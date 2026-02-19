#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for script in "$ROOT_DIR/scripts"/*.sh; do
  bash -n "$script"
done

echo "Shell syntax checks passed"
"$ROOT_DIR/scripts/build.sh"

if [[ ! -f "$ROOT_DIR/dist/index.html" ]]; then
  echo "Build smoke test failed: dist/index.html not found" >&2
  exit 1
fi

echo "Build smoke test passed"
