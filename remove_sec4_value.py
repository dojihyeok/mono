import re
import os

files_to_update = [
    '/Users/yunhyeok/mono/public/pitch.html',
    '/Users/yunhyeok/mono/test.html',
    '/Users/yunhyeok/mono/temp_pitch_only.html',
    '/Users/yunhyeok/mono/temp_pitch/client/public/pitch.html'
]

pattern = re.compile(r'<!-- 4막 하단 · 기업 가치 제고 마일스톤 -->.*?<!-- 연결부 카피 — GTM → 투자 -->.*?</a>\s*</div>\s*</div>', re.DOTALL)

for path in files_to_update:
    if not os.path.exists(path):
        print(f"Skipping {path}, not found.")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = pattern.sub('', content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed section from {path}")
    else:
        print(f"Section not found in {path}")
