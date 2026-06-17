import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix substring replacements
html = html.replace('bg-warm-500', 'bg-tech-500')
html = html.replace('bg-warm-1000', 'bg-tech-1000') # if any
html = html.replace('text-ink-9000', 'text-warm-500') # if any
html = html.replace('text-ink-8000', 'text-warm-1000') # if any
html = html.replace('border-ink-900/100', 'border-tech-400') # if any

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("fixed substring issues")
