with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace R4 text
old_r4_selection = '<div class="text-2xl font-black text-ink-900">100명의 경연 → 우승자 선정</div>'
new_r4_selection = '<div class="text-2xl font-black text-ink-900">TOP 10 선발 → 국민 평가 거쳐 최종 우승 1인 포함 5명 수상</div>'

if old_r4_selection in html:
    html = html.replace(old_r4_selection, new_r4_selection, 1)
    print("Updated R4 selection text.")
else:
    print("Could not find R4 selection text.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
