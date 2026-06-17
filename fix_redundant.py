with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    '1R · 지역 예선': '지역 예선',
    '2R · 지역별 오디션': '지역별 오디션',
    '3R · 권역별 오디션': '권역별 오디션',
    '4R · 전국 오디션': '전국 오디션'
}

for old, new in replacements.items():
    if old in html:
        html = html.replace(old, new)
        print(f"Replaced {old} -> {new}")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Finished replacements.")
