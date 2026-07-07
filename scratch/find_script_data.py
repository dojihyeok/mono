import re
import json

with open('/Users/yunhyeok/mono/refer/MONO_BM.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for any script tags and print their contents or parts of them
script_tags = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
print(f"Found {len(script_tags)} script tags")

for idx, tag in enumerate(script_tags):
    if len(tag.strip()) > 500:
        print(f"Script tag {idx} length: {len(tag)}")
        # Look for keywords in this tag
        for kw in ["ARPU", "GTM", "Pain Point", "PMF", "경쟁사", "차별성"]:
            count = len(re.findall(kw, tag))
            if count > 0:
                print(f"  - '{kw}' found {count} times")
