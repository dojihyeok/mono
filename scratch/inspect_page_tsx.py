import re

with open('/Users/yunhyeok/mono/web/app/bm/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"File length: {len(content)}")

# Search for any script tags inside the HTML string
script_tags = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
print(f"Found {len(script_tags)} script tags in HTML string")

for idx, tag in enumerate(script_tags):
    print(f"Script tag {idx} (length {len(tag)}):")
    print(tag.strip()[:300])
    print("...")

# Let's search for click event handlers or other variables
# like onclick, onmouseover, addEventListener
for handler in ["onclick", "click", "addEventListener", "function"]:
    matches = [m.start() for m in re.finditer(handler, content)]
    print(f"Keyword '{handler}' found {len(matches)} times")
    if matches:
        print(f"  First match snippet: {content[max(0, matches[0]-50):matches[0]+150]}")
