import re
with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()
tailwind = re.findall(r'colors:\s*\{.*?\}', html, re.DOTALL)
if tailwind:
    print(tailwind[0])
