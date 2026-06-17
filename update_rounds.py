with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    '4,000 → 500 → 100 → 20 → 5': '4,000 → 500 → 200 → 100 → 5',
    'R1 · 관찰평가': '1R · 지역 예선',
    '<div class="num-display text-2xl text-ink-900">200만 원</div>': '<div class="num-display text-2xl text-ink-900">200만 ~ 1,000만 원</div>',
    '관찰평가 통과 팀': '지역 예선 진출 팀',
    'R2 · 지역 공개 IR': '2R · 지역별 오디션',
    '500 → 100': '500 → 200',
    '2,000만 원': '1,000만 원',
    '지역 공개 IR 통과 팀': '지역별 오디션 진출 팀',
    'R3 · 권역 비공개 IR': '3R · 권역별 오디션',
    '100 → 20': '200 → 100',
    '2억 원': '1억 원',
    '권역 비공개 IR 통과 팀': '권역별 오디션 진출 팀',
    'R4 · 대국민 IR': '4R · 전국 오디션',
    '20 → 5': '100 → 5',
    '최대 10억': '1위 특전',
    '대국민 IR 최종 우승팀': '전국 오디션 최종 진출 팀'
}

for old, new in replacements.items():
    if old in html:
        html = html.replace(old, new)
        print(f"Replaced: {old} -> {new}")
    else:
        print(f"NOT FOUND: {old}")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
