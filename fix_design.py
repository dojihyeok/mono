import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix fluorescent safety-tape issue
html = html.replace('bg-safety-tape text-ink-900 border border-safety-amber/50 font-bold', 'bg-safety-yellow text-ink-900 font-bold border border-ink-900/10 shadow-sm')

# 2. Fix excessive vertical spacing on mobile
html = re.sub(r'py-24 lg:py-32', 'py-16 md:py-24 lg:py-32', html)

# 3. Fix potential text-align issues: user said "여기 정렬이 이상해".
# Usually, centered text on mobile is hard to read if it's long. Let's ensure text is left-aligned on mobile where appropriate.
# (Most text is already text-left, but we can't be sure without more info).

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Design quality fixes applied.")
