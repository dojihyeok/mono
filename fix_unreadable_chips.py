import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace dark teal backgrounds with warm light backgrounds for better contrast
html = html.replace('bg-tech-700 text-ink-900', 'bg-warm-100 text-ink-900 border border-ink-900/15')

# Ensure border doesn't duplicate if it already had one
html = html.replace('border border-ink-900/15 border-r border-warm-50/10', 'border-r border-ink-900/15')
html = html.replace('border border-ink-900/15 border border-ink-900', 'border border-ink-900')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Fixed unreadable chips.")
