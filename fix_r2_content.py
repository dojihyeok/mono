with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace R2 support text
old_r2_support = '<div class="text-lg text-ink-800 leading-relaxed">초기 시제품 (MVP) 제작 비용 최대 1천만원 + 책임 멘토링 + 선배 멘토링</div>'
new_r2_support = '<div class="text-lg text-ink-800 leading-relaxed">본 라운드(공개 IR 오디션) 합격 후 3라운드 진출 시 <strong class="text-ink-900">시제품 고도화 비용 최대 1천만 원 추가 지원</strong> + 선배 창업 멘토링</div>'

if old_r2_support in html:
    html = html.replace(old_r2_support, new_r2_support, 1)
    print("Updated R2 support text.")
else:
    print("Could not find R2 support text.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
