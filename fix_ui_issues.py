import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix 1: section-label wrapping
target1 = ".section-label { font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #0E7490; letter-spacing: -0.01em; display: inline-flex; align-items: center; gap: 0.625rem; }"
replacement1 = ".section-label { font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 700; color: #0E7490; letter-spacing: -0.01em; display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.625rem; max-width: 100%; }"
html = html.replace(target1, replacement1)

# Fix 2: shrink-0 on database icon
target2 = '<span class="w-10 h-10 bg-warm-50 border border-ink-900/10 text-ink-900 grid place-items-center lcorner'
replacement2 = '<span class="shrink-0 w-10 h-10 bg-warm-50 border border-ink-900/10 text-ink-900 grid place-items-center lcorner'
html = html.replace(target2, replacement2)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("UI issues fixed.")
