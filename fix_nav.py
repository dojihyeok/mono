import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Next MONO to the desktop nav
nav_search = '<a class="nav-link" href="#lifecycle">브랜드 철학</a>'
nav_replace = '<a class="nav-link" href="#lifecycle">브랜드 철학</a>\n      <a class="nav-link" href="#vision">Next MONO</a>'

if '<a class="nav-link" href="#vision">Next MONO</a>' not in html[:1000]: # Only check top nav area
    html = html.replace(nav_search, nav_replace, 1)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added Next MONO to the top nav.")
