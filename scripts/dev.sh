#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$ROOT_DIR/scripts/build.sh"

cd "$ROOT_DIR/dist"
echo "Preview: http://localhost:8000"
python3 -m http.server 8000
