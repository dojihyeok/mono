#!/bin/bash
#
# SessionStart hook for Claude Code on the web.
# Prepares the MoNo (Next.js 14 + Prisma) project so tests, linters and
# builds can run as soon as a remote session starts.
#
# Design notes:
#   - Synchronous: dependencies are guaranteed ready before the session begins.
#   - Defensive: safe to run on an empty repo (no package.json yet).
#   - Idempotent & non-interactive: safe to run repeatedly, never prompts.
#   - Package-manager agnostic: auto-detected from the lockfile.

set -euo pipefail

# Only run inside the remote (Claude Code on the web) environment.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Nothing to install until the application code lands in the repo.
if [ ! -f package.json ]; then
  echo "[session-start] package.json not found — repo is empty, skipping setup."
  exit 0
fi

# Detect the package manager from the lockfile (default: npm).
if [ -f pnpm-lock.yaml ]; then
  PM="pnpm"
elif [ -f yarn.lock ]; then
  PM="yarn"
else
  PM="npm"
fi

# Ensure pnpm/yarn is available (corepack ships with modern Node).
if [ "$PM" != "npm" ] && ! command -v "$PM" >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
  corepack prepare "$PM@latest" --activate >/dev/null 2>&1 || true
fi

echo "[session-start] installing dependencies with $PM ..."
# Prefer plain install (not ci) so the cached container layer is reused.
case "$PM" in
  pnpm) pnpm install ;;
  yarn) yarn install --immutable || yarn install ;;
  npm)  npm install ;;
esac

# Generate the Prisma client whenever a schema is present.
if [ -f prisma/schema.prisma ]; then
  echo "[session-start] generating Prisma client ..."
  npx prisma generate
fi

echo "[session-start] setup complete."
