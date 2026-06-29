#!/usr/bin/env bash
# 작업 요약을 Slack Incoming Webhook으로 전송.
# URL은 .slack-webhook(gitignore)에서만 읽고, 화면/로그/argv에 노출하지 않음.
# 사용: scripts/slack-notify.sh "메시지"   (여러 줄 가능)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK_FILE="$ROOT/.slack-webhook"

[ -f "$HOOK_FILE" ] || { echo "✗ .slack-webhook 파일 없음 — Webhook URL 한 줄 넣어줘."; exit 1; }
URL="$(tr -d '[:space:]' < "$HOOK_FILE")"
[ -n "$URL" ] || { echo "✗ .slack-webhook 비어있음 — Webhook URL 넣어줘."; exit 1; }

MSG="${1:-}"
[ -n "$MSG" ] || { echo "usage: scripts/slack-notify.sh \"메시지\""; exit 1; }

# JSON 인코딩(따옴표·줄바꿈 안전) — 메시지는 env로 넘김(argv 회피).
PAYLOAD="$(MSG="$MSG" python3 -c 'import json,os;print(json.dumps({"text":os.environ["MSG"]}))')"

# URL을 argv 대신 -K(설정 stdin)로 전달 → ps에 URL 안 뜸. ponytail: 로컬 단일 사용자 기준.
code="$(printf 'url = "%s"\n' "$URL" | curl -s -K - -o /dev/null -w '%{http_code}' \
  -X POST -H 'Content-Type: application/json' -d "$PAYLOAD")"

[ "$code" = "200" ] && echo "✓ slack 전송 완료" || { echo "✗ slack 실패 HTTP $code"; exit 1; }
