import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace in nav links
html = html.replace('<a class="nav-link" href="#problem">해결과제</a>', '<a class="nav-link" href="#problem">MONO 비전</a>')
html = html.replace('<a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#problem">해결과제</a>', '<a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#problem">MONO 비전</a>')

# Replace in comment
html = html.replace('<!-- ============================== S2 · 해결 과제 & 상생 산업 인프라 ============================== -->', '<!-- ============================== S2 · MONO 비전 & 상생 산업 인프라 ============================== -->')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced '해결과제' with 'MONO 비전'")
