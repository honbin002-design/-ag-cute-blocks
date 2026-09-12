#!/usr/bin/env bash
set -euo pipefail

rm -rf dist-test
mkdir -p dist-test

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.github' \
  ! -name 'dist-test' \
  ! -name 'netlify-test-proxy' \
  ! -name '*.md' \
  -exec cp -R {} dist-test/ \;

# Hard safety gates for the TEST artifact.
test -f dist-test/index.html
test -f dist-test/bootstrap-v0510.js
grep -F "globalThis.AG_RUNTIME_ENVIRONMENT='TEST'" dist-test/bootstrap-v0510.js >/dev/null

# Never publish obvious secret assignments into the static TEST artifact.
# The two bridge client files legitimately reference the token/config field names,
# so exclude them from this static secret-literal scan.
if grep -R -n -E 'AGCB_BRIDGE_TOKEN[[:space:]]*=' dist-test \
  --exclude='save-drive-bridge-v05109.js' \
  --exclude='test-drive-backup-setup-v05104.js'; then
  echo 'Secret-like AGCB_BRIDGE_TOKEN assignment found in Vercel TEST artifact.' >&2
  exit 1
fi

if grep -R -n -E 'authToken[[:space:]]*=' dist-test \
  --exclude='save-drive-bridge-v05109.js' \
  --exclude='test-drive-backup-setup-v05104.js'; then
  echo 'Secret-like authToken assignment found in Vercel TEST artifact.' >&2
  exit 1
fi

printf 'AG Cute Blocks Vercel TEST artifact ready\n'
