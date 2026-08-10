#!/usr/bin/env bash
# Fail if files that look like secrets would be committed.
# Usage (from this frontend repo root):
#   ./scripts/check-no-secrets.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repo yet — run: git init"
  exit 0
fi

bad=0

is_example() {
  case "$1" in
    *.example|*.example.*|*.env.example)
      return 0
      ;;
  esac
  return 1
}

looks_secret_path() {
  case "$1" in
    *.env|*/.env|.env) return 0 ;;
    *.env.*|*/.env.*) return 0 ;;
    *.pem|credentials.json) return 0 ;;
    */.clerk/*|.clerk/*) return 0 ;;
  esac
  return 1
}

while IFS= read -r f; do
  [ -z "$f" ] && continue
  if is_example "$f"; then
    continue
  fi
  if looks_secret_path "$f"; then
    echo "SECRET RISK: $f"
    bad=1
  fi
done <<EOF
$(git ls-files --cached --others --exclude-standard)
EOF

while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ -f "$f" ] || continue
  if is_example "$f"; then
    continue
  fi
  case "$f" in
    *node_modules*|*.lock|*.png|*.jpg|*.jpeg|*.webp|*.ico|*.woff*|*.map)
      continue
      ;;
  esac
  if grep -Eqi 'sk_live_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|BEGIN (RSA |OPENSSH )?PRIVATE KEY|mongodb\+srv://[^:]+:[^@[:space:]]+@|rzp_live_[A-Za-z0-9]+' "$f" 2>/dev/null; then
    echo "SECRET CONTENT?: $f"
    bad=1
  fi
done <<EOF
$(git ls-files)
EOF

if [ "$bad" -ne 0 ]; then
  echo "Refusing: remove secrets before push."
  exit 1
fi

echo "OK: no obvious secrets in git index / working tree tracked files."
