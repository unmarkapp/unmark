#!/usr/bin/env bash
# One-time Azure resources for GitHub Actions frontend deploy.
#
# Prereqs: az CLI, logged in (az login), subscription selected.
#
# Usage:
#   export AZURE_RESOURCE_GROUP=unmark-rg
#   export ACR_NAME=unmarkacr
#   export AZURE_CONTAINER_APP_NAME=unmark-frontend
#   export AZURE_CONTAINER_APP_ENV=unmark-cae
#   export AZURE_LOCATION=centralindia
#   ./infra/azure/provision.sh
#
# Then grant the GitHub Actions service principal:
#   - Contributor on the resource group
#   - AcrPush on the ACR
#
# Create AZURE_CREDENTIALS secret (GitHub → Settings → Secrets):
#   az ad sp create-for-rbac --name github-unmark-frontend \
#     --role contributor \
#     --scopes /subscriptions/<SUB_ID>/resourceGroups/<RG> \
#     --sdk-auth
set -euo pipefail

RG="${AZURE_RESOURCE_GROUP:-unmark-rg}"
LOCATION="${AZURE_LOCATION:-centralindia}"
ACR="${ACR_NAME:-unmarkacr}"
APP="${AZURE_CONTAINER_APP_NAME:-unmark-frontend}"
CAE="${AZURE_CONTAINER_APP_ENV:-unmark-cae}"
LOG_WS="${AZURE_LOG_ANALYTICS:-unmark-logs}"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "missing: $1" >&2; exit 1; }
}

need_cmd az

SUB_ID="$(az account show --query id -o tsv)"
echo "==> Subscription: $SUB_ID"

register_provider() {
  local ns="$1"
  local state
  state="$(az provider show --namespace "$ns" --query registrationState -o tsv 2>/dev/null || echo NotRegistered)"
  if [[ "$state" == "Registered" ]]; then
    echo "    $ns — already registered"
    return
  fi
  echo "    $ns — registering (fresh subscriptions can take 1–3 min)..."
  az provider register --namespace "$ns" --wait
  echo "    $ns — done"
}

echo "==> Register Azure resource providers (required on new subscriptions)"
register_provider Microsoft.ContainerRegistry
register_provider Microsoft.App
register_provider Microsoft.OperationalInsights
register_provider Microsoft.Insights

echo "==> Resource group: $RG ($LOCATION)"
az group create --name "$RG" --location "$LOCATION" --output none

echo "==> Container registry: $ACR"
if az acr show --name "$ACR" --resource-group "$RG" >/dev/null 2>&1; then
  echo "    already exists"
else
  az acr create \
    --resource-group "$RG" \
    --name "$ACR" \
    --sku Basic \
    --admin-enabled false \
    --output none
fi

ACR_ID="$(az acr show --name "$ACR" --resource-group "$RG" --query id -o tsv)"
LOGIN_SERVER="${ACR}.azurecr.io"

echo "==> Log Analytics: $LOG_WS"
if az monitor log-analytics workspace show --resource-group "$RG" --workspace-name "$LOG_WS" >/dev/null 2>&1; then
  echo "    already exists"
else
  az monitor log-analytics workspace create \
    --resource-group "$RG" \
    --workspace-name "$LOG_WS" \
    --location "$LOCATION" \
    --output none
fi

LOG_ID="$(az monitor log-analytics workspace show \
  --resource-group "$RG" --workspace-name "$LOG_WS" --query customerId -o tsv)"
LOG_KEY="$(az monitor log-analytics workspace get-shared-keys \
  --resource-group "$RG" --workspace-name "$LOG_WS" --query primarySharedKey -o tsv)"

echo "==> Container Apps environment: $CAE"
if az containerapp env show --name "$CAE" --resource-group "$RG" >/dev/null 2>&1; then
  echo "    already exists"
else
  az containerapp env create \
    --name "$CAE" \
    --resource-group "$RG" \
    --location "$LOCATION" \
    --logs-workspace-id "$LOG_ID" \
    --logs-workspace-key "$LOG_KEY" \
    --output none
fi

echo "==> Container app: $APP (same Docker image as AWS EKS — GitHub Actions deploys :latest)"
ensure_acr_pull() {
  az containerapp identity assign \
    --name "$APP" --resource-group "$RG" \
    --system-assigned --output none 2>/dev/null || true

  local principal_id
  principal_id="$(az containerapp show --name "$APP" --resource-group "$RG" \
    --query identity.principalId -o tsv 2>/dev/null || true)"
  if [[ -n "$principal_id" && "$principal_id" != "None" ]]; then
    az role assignment create \
      --assignee "$principal_id" \
      --role AcrPull \
      --scope "$ACR_ID" \
      --output none 2>/dev/null || true
  fi

  # Pull from ACR using managed identity (like EKS IRSA → ECR)
  az containerapp registry set \
    --name "$APP" \
    --resource-group "$RG" \
    --server "$LOGIN_SERVER" \
    --identity system \
    --output none
  ok "ACR pull via managed identity → $LOGIN_SERVER"
}

ok() { printf '\033[1;32mOK\033[0m %s\n' "$*" >&2; }

if az containerapp show --name "$APP" --resource-group "$RG" >/dev/null 2>&1; then
  echo "    already exists — wiring ACR pull"
  ensure_acr_pull
else
  # Placeholder from MCR only (no ACR creds needed yet); real image comes from GitHub Actions
  az containerapp create \
    --name "$APP" \
    --resource-group "$RG" \
    --environment "$CAE" \
    --image "mcr.microsoft.com/k8se/quickstart:latest" \
    --target-port 3000 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 3 \
    --cpu 0.5 \
    --memory 1Gi \
    --system-assigned \
    --output none
  ensure_acr_pull
  ok "created $APP (placeholder image until first GitHub Actions deploy)"
fi

FQDN="$(az containerapp show --name "$APP" --resource-group "$RG" \
  --query 'properties.configuration.ingress.fqdn' -o tsv)"

cat <<EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Azure frontend infra ready

  Resource group:     $RG
  Location:           $LOCATION
  ACR:                $LOGIN_SERVER
  Container App env:  $CAE
  Container App:      $APP
  Default URL:        https://${FQDN}

  Set GitHub Actions variables:
    AZURE_RESOURCE_GROUP=$RG
    ACR_NAME=$ACR
    AZURE_CONTAINER_APP_NAME=$APP
    AZURE_CONTAINER_APP_ENV=$CAE
    AZURE_LOCATION=$LOCATION
    NEXT_PUBLIC_API_URL=https://api.unmark.ink
    NEXT_PUBLIC_AUTH_URL=https://auth.unmark.ink
    NEXT_PUBLIC_BILLING_URL=https://billing.unmark.ink

  Set GitHub secret AZURE_CREDENTIALS (service principal JSON with Contributor on RG).

  Grant the SP AcrPush on ACR (replace <SP_APP_ID>):
    az role assignment create --assignee <SP_APP_ID> --role AcrPush --scope $ACR_ID

  Custom domain (unmark.ink):
    az containerapp hostname add -g $RG -n $APP --hostname unmark.ink
    # Add the TXT + CNAME records Azure shows in Namecheap Advanced DNS

  Push to main (frontend/**) or run workflow manually to deploy.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
