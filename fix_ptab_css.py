import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_css = """  .ptab { transition: background-color .25s ease, color .25s ease, border-color .25s ease; }
  .ptab.active { background:#0A0F1A; color:#F5F2EB; border-color:#0A0F1A; }
  .ptab.active .ptab-num { color:#C5A880; }"""

new_css = """  .ptab { padding: 10px 24px; border-radius: 9999px; transition: all .25s ease; border: 1px solid transparent; font-weight: 700; color: #475569; }
  .ptab:hover { color: #0A0F1A; background: rgba(10, 15, 26, 0.03); }
  .ptab.active { background:#0E7490; color:#FFFFFF; border-color:#0E7490; box-shadow: 0 4px 14px rgba(14, 116, 144, 0.25); }
  .ptab.active .ptab-num { color:#A5F3FC; }"""

if old_css in html:
    html = html.replace(old_css, new_css)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed ptab CSS")
else:
    print("Could not find old CSS")
