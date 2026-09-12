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

# Never publish obvious secret material into the static TEST artifact.
if grep -R -n -E 'AGCB_BRIDGE_TOKEN[[:space:]]*=|authToken[[:space:]]*=[[:space:]]*["'"'][^"'"']{16,}' dist-test --exclude='save-drive-bridge-v05109.js' --exclude='test-drive-backup-setup-v05104.js'; then
  echo 'Secret-like material found in Vercel TEST artifact.' >&2
  exit 1
fi

printf 'AG Cute Blocks Vercel TEST artifact ready\n'
