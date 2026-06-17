import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('bg-ink-800 border border-ink-700/50 text-ink-800', 'bg-warm-100 border border-ink-200 text-ink-900')
html = html.replace('hover:bg-ink-700', 'hover:bg-warm-200')

html = html.replace('bg-ink-800 text-ink-800', 'bg-warm-100 text-ink-900 border border-ink-200')

# Also fix the sim-icon-bg
html = html.replace('bg-ink-700 text-ink-900', 'bg-warm-200 text-ink-900')
html = html.replace("classList.add('bg-ink-700')", "classList.add('bg-warm-200')")
html = html.replace("classList.remove('bg-ink-700')", "classList.remove('bg-warm-200')")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("fixed ink bugs")
