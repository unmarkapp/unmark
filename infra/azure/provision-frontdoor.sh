#!/usr/bin/env bash
# Front Door (CDN) for Unmark static Next.js assets via the frontend Container App.
# Media (presigned S3 / share streams) stays private — only cache public static paths.
#
# Prereqs: az CLI, Contributor on the resource group, frontend app already provisioned.
#
# Usage:
#   ./infra/azure/provision-frontdoor.sh
#   FRONTDOOR_NAME=unmark-fd DOMAIN=www.unmark.ink ./infra/azure/provision-frontdoor.sh
set -euo pipefail

RG="${AZURE_RESOURCE_GROUP:-unmark-rg}"
LOCATION="${AZURE_LOCATION:-global}"
FRONTDOOR="${FRONTDOOR_NAME:-unmark-fd}"
ENDPOINT="${FRONTDOOR_ENDPOINT:-www}"
ORIGIN_HOST="${ORIGIN_HOST:-}"  # e.g. unmark-frontend.<region>.azurecontainerapps.io
APP="${AZURE_CONTAINER_APP_NAME:-unmark-frontend}"
DOMAIN="${CDN_CUSTOM_DOMAIN:-www.unmark.ink}"

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1" >&2; exit 1; }; }
need_cmd az

if [[ -z "$ORIGIN_HOST" ]]; then
  ORIGIN_HOST="$(az containerapp show -g "$RG" -n "$APP" \
    --query properties.configuration.ingress.fqdn -o tsv 2>/dev/null || true)"
fi
[[ -n "$ORIGIN_HOST" ]] || {
  echo "Set ORIGIN_HOST to the frontend Container App FQDN" >&2
  exit 1
}

echo "==> Azure Front Door profile: $FRONTDOOR (origin=$ORIGIN_HOST)"

# Standard SKU is enough for static Next assets + origin shield behavior.
if az afd profile show -g "$RG" --profile-name "$FRONTDOOR" >/dev/null 2>&1; then
  echo "    profile exists"
else
  az afd profile create -g "$RG" --profile-name "$FRONTDOOR" \
    --sku Standard_AzureFrontDoor --output none
fi

if az afd endpoint show -g "$RG" --profile-name "$FRONTDOOR" --endpoint-name "$ENDPOINT" >/dev/null 2>&1; then
  echo "    endpoint exists"
else
  az afd endpoint create -g "$RG" --profile-name "$FRONTDOOR" \
    --endpoint-name "$ENDPOINT" --enabled-state Enabled --output none
fi

OG="origin-frontend"
if az afd origin-group show -g "$RG" --profile-name "$FRONTDOOR" --origin-group-name "$OG" >/dev/null 2>&1; then
  echo "    origin-group exists"
else
  az afd origin-group create -g "$RG" --profile-name "$FRONTDOOR" \
    --origin-group-name "$OG" \
    --probe-request-type GET --probe-protocol Https --probe-path "/health" \
    --sample-size 4 --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50 \
    --output none 2>/dev/null || \
  az afd origin-group create -g "$RG" --profile-name "$FRONTDOOR" \
    --origin-group-name "$OG" --output none
fi

if az afd origin show -g "$RG" --profile-name "$FRONTDOOR" \
  --origin-group-name "$OG" --origin-name "aca-frontend" >/dev/null 2>&1; then
  echo "    origin exists"
else
  az afd origin create -g "$RG" --profile-name "$FRONTDOOR" \
    --origin-group-name "$OG" --origin-name "aca-frontend" \
    --host-name "$ORIGIN_HOST" \
    --origin-host-header "$ORIGIN_HOST" \
    --priority 1 --weight 1000 --enabled-state Enabled \
    --http-port 80 --https-port 443 \
    --output none
fi

# Cache _next/static aggressively; leave HTML/API routes to origin Cache-Control.
RULESET="static-assets"
if ! az afd rule-set show -g "$RG" --profile-name "$FRONTDOOR" --rule-set-name "$RULESET" >/dev/null 2>&1; then
  az afd rule-set create -g "$RG" --profile-name "$FRONTDOOR" --rule-set-name "$RULESET" --output none
fi

if ! az afd rule show -g "$RG" --profile-name "$FRONTDOOR" --rule-set-name "$RULESET" \
  --rule-name "cache-next-static" >/dev/null 2>&1; then
  az afd rule create -g "$RG" --profile-name "$FRONTDOOR" --rule-set-name "$RULESET" \
    --rule-name "cache-next-static" --order 1 --match-variable RequestUri \
    --operator BeginsWith --match-values "/_next/static/" \
    --action-name ModifyResponseHeader --header-action Overwrite \
    --header-name "Cache-Control" --header-value "public, max-age=31536000, immutable" \
    --output none 2>/dev/null || echo "WARN: rule create may need portal tweak for caching"
fi

ROUTE="default-https"
if ! az afd route show -g "$RG" --profile-name "$FRONTDOOR" --endpoint-name "$ENDPOINT" \
  --route-name "$ROUTE" >/dev/null 2>&1; then
  az afd route create -g "$RG" --profile-name "$FRONTDOOR" --endpoint-name "$ENDPOINT" \
    --route-name "$ROUTE" --origin-group "$OG" --supported-protocols Http Https \
    --https-redirect Enabled --forwarding-protocol HttpsOnly \
    --link-to-default-domain Enabled --rule-sets "$RULESET" \
    --output none
fi

FD_HOST="$(az afd endpoint show -g "$RG" --profile-name "$FRONTDOOR" \
  --endpoint-name "$ENDPOINT" --query hostName -o tsv)"

cat <<EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Front Door ready

  Endpoint: https://${FD_HOST}
  Origin:   https://${ORIGIN_HOST}

  Next:
    1. Add custom domain ${DOMAIN} on the endpoint (TXT + CNAME validation)
    2. Point ${DOMAIN} DNS to Front Door (not directly to ACA)
    3. Keep media private: share/download URLs must not be long-cache public CDN
       (presigned S3 + /s/{jobId} with short private cache only)

  Docs: https://learn.microsoft.com/azure/frontdoor/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
