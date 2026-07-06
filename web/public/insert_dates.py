import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R1
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&amp;서면 평가</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.05–07</div>\n<h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&amp;서면 평가</h3>'
)

# R2
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">지역별 멘토 기관 대상 공개 IR 오디션</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.08–09</div>\n<h3 class="text-xl font-black text-ink-900">지역별 멘토 기관 대상 공개 IR 오디션</h3>'
)

# R3
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">전국 5개 권역 통합 공개 IR 오디션</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.10–11</div>\n<h3 class="text-xl font-black text-ink-900">전국 5개 권역 통합 공개 IR 오디션</h3>'
)

# R4
html = html.replace(
    '<h3 class="text-xl font-black text-ink-900">왕중왕전 (대국민 오디션)</h3>',
    '<div class="mono text-[12px] text-ink-500 mb-1 font-bold tracking-wide">2026.12–</div>\n<h3 class="text-xl font-black text-ink-900">왕중왕전 (대국민 오디션)</h3>'
)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Dates inserted.")
