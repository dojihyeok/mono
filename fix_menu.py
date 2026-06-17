import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix desktop nav
content = content.replace(
    '<a class="nav-link" href="#gtm">MONO 성장 전략 (GTM)</a>',
    '<a class="nav-link" href="#gtm">MONO 성장 전략</a>'
)

# Fix mobile nav
content = content.replace(
    '<a class="mob-nav-link py-1 hover:text-tech-700 transition-colors" href="#gtm">MONO 성장 전략 (GTM)</a>',
    '<a class="mob-nav-link py-1 hover:text-tech-700 transition-colors" href="#gtm">MONO 성장 전략</a>'
)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Menu fixed")
