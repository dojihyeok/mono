with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# For R1, replace the text in the 2/3 column
old_r1_support = '<div class="text-lg text-ink-800 leading-relaxed">초기 시제품 (MVP) 제작 비용 최대 1천만원 + 책임멘토링 및 기술 멘토링</div>'
new_r1_support = '<div class="text-lg text-ink-800 leading-relaxed">아이디어 심사 통과 창업 활동 자금 <strong class="text-ink-900">200만원</strong> 지원<br/>본 라운드(관찰·서면 평가) 통과 후 2라운드 진출 시 <strong class="text-ink-900">초기 시제품 제작비 1천만원</strong> 지원</div>'

if old_r1_support in html:
    html = html.replace(old_r1_support, new_r1_support, 1)
    print("Updated R1 support text.")
else:
    print("Could not find R1 support text.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
