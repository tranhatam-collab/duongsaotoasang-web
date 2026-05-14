#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_NAME="${PROJECT_NAME:-duongsaotoasang-com-v2}"
BRANCH="${BRANCH:-main}"
SHA="$(git rev-parse --short HEAD)"
TMP_PARENT="${TMPDIR:-/tmp}"
BUNDLE_DIR="$(mktemp -d "${TMP_PARENT%/}/dsts-pages-deploy-${SHA}.XXXXXX")"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[FAIL] missing command: $1" >&2
    exit 2
  }
}

need_cmd git
need_cmd tar
need_cmd find
need_cmd wc

if ! git diff --quiet --exit-code || ! git diff --cached --quiet --exit-code; then
  echo "[FAIL] tracked working tree has uncommitted changes."
  echo "       Commit or stash first. This script deploys exactly HEAD."
  exit 1
fi

git archive --format=tar HEAD | tar -xf - -C "$BUNDLE_DIR"

artifact_count="$(find "$BUNDLE_DIR" -type f | wc -l | tr -d ' ')"
junk_paths="$(find "$BUNDLE_DIR" \
  -name ".DS_Store" \
  -o -path "*/.wrangler/*" \
  -o -path "*/.claude/*" \
  -o -path "$BUNDLE_DIR/_redirects 2" \
  -o -path "$BUNDLE_DIR/functions/api/content 2.js" \
  -o -path "$BUNDLE_DIR/functions/api/contents 2.js" \
  -o -path "$BUNDLE_DIR/dsts-bug-report.md" \
  || true)"

if [ -n "$junk_paths" ]; then
  echo "[FAIL] clean deploy bundle contains local junk:"
  echo "$junk_paths"
  exit 1
fi

echo "== DSTS clean Pages deploy =="
echo "Commit:  $SHA"
echo "Project: $PROJECT_NAME"
echo "Branch:  $BRANCH"
echo "Bundle:  $BUNDLE_DIR"
echo "Files:   $artifact_count"

if [ "${1:-}" = "--dry-run" ]; then
  echo "[PASS] dry run only; no deploy executed."
  exit 0
fi

need_cmd wrangler
wrangler pages deploy "$BUNDLE_DIR" \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH" \
  --commit-hash "$SHA"
