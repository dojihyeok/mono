import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix .section-label CSS
old_css = r"\.section-label\s*\{\s*font-family:\s*'Pretendard',\s*sans-serif;\s*font-size:\s*18px;\s*font-weight:\s*700;\s*color:\s*#0E7490;\s*letter-spacing:\s*-0.01em;\s*display:\s*inline-flex;\s*flex-wrap:\s*wrap;\s*align-items:\s*center;\s*gap:\s*0\.625rem;\s*max-width:\s*100%;\s*\}"
new_css = """.section-label { font-family: 'Pretendard', sans-serif; font-size: 16px; font-weight: 800; color: #0E7490; letter-spacing: -0.01em; display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 0.5rem; max-width: 100%; word-break: keep-all; line-height: 1.4; }
@media (min-width: 768px) { .section-label { font-size: 18px; } }"""

if re.search(old_css, html):
    html = re.sub(old_css, new_css, html)
    print("CSS updated successfully via regex.")
else:
    print("Could not find exact CSS string. Replacing fallback.")
    html = html.replace("display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.625rem; max-width: 100%;", "display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; max-width: 100%; word-break: keep-all; line-height: 1.4;")

# Also fix the specific section-label that had hardcoded `text-xl md:text-2xl`
html = html.replace('<div class="section-label text-xl md:text-2xl font-black mb-6">', '<div class="section-label mb-6">')
html = html.replace('<span class="num text-[16px] md:text-[18px] px-3 py-1">', '<span class="num">')

# Do the same for section 02
html = html.replace('<div class="section-label text-xl md:text-2xl font-black mb-6">', '<div class="section-label mb-6">')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied fixes for section-label wrapping.")
