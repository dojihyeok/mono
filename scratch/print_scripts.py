import re

with open('/Users/yunhyeok/mono/refer/MONO_BM.html', 'r', encoding='utf-8') as f:
    content = f.read()

script_tags = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)

for idx in [7, 8, 9]:
    if idx < len(script_tags):
        print(f"=== Script Tag {idx} ===")
        print(script_tags[idx].strip()[:500])
        print("...")
