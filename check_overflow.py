import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

sections = re.findall(r'<section[^>]*>', html)
for s in sections:
    print(s)
