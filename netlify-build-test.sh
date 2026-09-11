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

test -f dist-test/index.html
test -f dist-test/bootstrap-v0510.js
printf 'AG Cute Blocks TEST direct artifact ready\n'
