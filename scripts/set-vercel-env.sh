#!/usr/bin/env bash
# Pushes the service credentials this site needs into Vercel, for all three
# environments, in one shot.
#
# Neon (DATABASE_URL) and GOELS_ADMIN_EMAILS are already set: Neon was
# provisioned through the Vercel marketplace, which wires its own env vars.
# The two that cannot be minted from a CLI are Clerk (no CLI exists) and the R2
# S3 token (Cloudflare only issues those from the dashboard). Put them in
# .env.services and run this.
#
#   cp .env.services.example .env.services   # then fill it in
#   ./scripts/set-vercel-env.sh
#
# .env.services is gitignored. It holds live secrets; never commit it.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.services ]; then
  echo "Missing .env.services. Copy .env.services.example and fill it in." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; . ./.env.services; set +a

VARS=(
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  R2_ACCOUNT_ID
  R2_BUCKET
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
)

for name in "${VARS[@]}"; do
  value="${!name:-}"
  if [ -z "$value" ]; then
    echo "skip  $name (empty)"
    continue
  fi
  # Preview takes an empty branch argument, which means "all preview branches".
  vercel env add "$name" production --value "$value" --force --yes >/dev/null
  vercel env add "$name" preview "" --value "$value" --force --yes >/dev/null
  vercel env add "$name" development --value "$value" --force --yes >/dev/null
  echo "set   $name"
done

echo
echo "Done. Redeploy for the new values to take effect:"
echo "  vercel deploy --prod --yes"
