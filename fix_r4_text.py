import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix text-warm-50 variations
html = html.replace('text-warm-50/80', 'text-ink-700')
html = html.replace('text-warm-50/70', 'text-ink-600')
html = html.replace('text-warm-50/85', 'text-ink-700')
html = html.replace('text-warm-50/75', 'text-ink-700')
html = html.replace('text-warm-50', 'text-ink-900')

# Fix text-tech-300 in R4
html = html.replace('text-tech-300 mb-2', 'text-ink-800 mb-2 font-bold')
html = html.replace('text-tech-300 mb-1', 'text-ink-800 mb-1 font-bold')
html = html.replace('text-2xl text-tech-300', 'text-2xl text-ink-900 font-black')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("fixed text colors")
