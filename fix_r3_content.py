with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace R3 support text
old_r3_support = '<div class="text-lg text-ink-800 leading-relaxed">차년도 사업 연계를 통한 사업화 자금 최대 1억원 + 책임 멘토링</div>'
new_r3_support = '<div class="text-lg text-ink-800 leading-relaxed">본 라운드(권역 오디션) 합격으로 전국 TOP 100 선발 시 <strong class="text-ink-900">최대 1억원의 사업화 자금</strong> + 연속성 있는 지원(차년도 사업 연계) + 1:1 책임 멘토링</div>'

if old_r3_support in html:
    html = html.replace(old_r3_support, new_r3_support, 1)
    print("Updated R3 support text.")
else:
    print("Could not find R3 support text.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
