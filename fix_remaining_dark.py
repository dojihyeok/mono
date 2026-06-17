import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R4 main card
html = html.replace('bg-ink-900 text-warm-50', 'bg-warm-100 text-ink-900 border border-ink-200')
html = html.replace('bg-ink-800 border border-tech-300/25', 'bg-warm-50 border border-ink-200')
html = html.replace('border border-tech-300/25', 'border border-ink-200')

# R4 tags and buttons
html = html.replace('bg-tech-300 text-ink-900', 'bg-warm-200 text-ink-900 border border-ink-200')
html = html.replace('hover:bg-ink-800', 'hover:bg-warm-200')

# Any other bg-ink-900 text-warm-50
html = html.replace('bg-ink-900/10', 'bg-warm-200/50')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("fixed remaining dark sections")
