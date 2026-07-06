import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R3
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">기술분야별 전문 투자사 대상 권역별 비공개 IR 오디션</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.10–11</div>\n<h3 class="text-xl font-black text-ink-900">기술분야별 전문 투자사 대상 권역별 비공개 IR 오디션</h3>'
)

# R4
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">파이널 오디션</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.12–</div>\n<h3 class="text-xl font-black text-ink-900">파이널 오디션</h3>'
)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Dates inserted for R3 and R4.")
