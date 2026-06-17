import os

files = [
    '/Users/yunhyeok/mono/public/pitch.html',
    '/Users/yunhyeok/mono/test.html',
    '/Users/yunhyeok/mono/temp_pitch_only.html',
    '/Users/yunhyeok/mono/temp_pitch/client/public/pitch.html'
]

for path in files:
    if not os.path.exists(path): continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply specific replacements for the R2 section
    content = content.replace("핵심 행동 탐색", "핵심 행동 검증")
    content = content.replace("탐색 계획", "검증 계획")
    content = content.replace("PMF 탐색", "PMF 검증")
    content = content.replace("Aha Moment 탐색", "Aha Moment 검증")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Replaced text in {path}")
