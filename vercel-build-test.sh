#!/usr/bin/env bash
set -euo pipefail

rm -rf dist-test
mkdir -p dist-test

find . -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.github' \
  ! -name 'dist-test' \
  ! -name 'netlify-test-proxy' \
  ! -name 'apps-script' \
  ! -name 'tests' \
  ! -name '*.md' \
  -exec cp -R {} dist-test/ \;

# Hard safety gates for the TEST artifact.
test -f dist-test/index.html
test -f dist-test/bootstrap-v0510.js
grep -F "globalThis.AG_RUNTIME_ENVIRONMENT='TEST'" dist-test/bootstrap-v0510.js >/dev/null

# Never publish hard-coded secret literals into the static TEST artifact.
# Variable names such as `authToken` are legitimate client code, so only reject
# assignments that contain a quoted value long enough to look like a real secret.
if grep -R -n -P "AGCB_BRIDGE_TOKEN\\s*=\\s*['\"][^'\"]{16,}['\"]" dist-test; then
  echo 'Hard-coded AGCB_BRIDGE_TOKEN secret found in Vercel TEST artifact.' >&2
  exit 1
fi

if grep -R -n -P "authToken\\s*=\\s*['\"][^'\"]{16,}['\"]" dist-test; then
  echo 'Hard-coded authToken secret found in Vercel TEST artifact.' >&2
  exit 1
fi

printf 'AG Cute Blocks Vercel TEST artifact ready\n'
