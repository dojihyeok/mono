import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the start of S4
target = '<!-- ============================== S4 · STRATEGY ============================== -->'
replacement = '<div class="tape-divider"></div>\n\n' + target

if '<div class="tape-divider"></div>\n\n<!-- ============================== S4' not in html:
    html = html.replace(target, replacement)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added tape-divider before S4.")
