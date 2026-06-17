import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Step 04
html = html.replace('shadow-[0_0_15px_rgba(34,211,238,0.1)]', 'shadow-sm')
html = html.replace('text-tech-100', 'text-ink-800')

# Step 07
html = html.replace('bg-gradient-to-br from-ink-800 to-tech-900/40', 'bg-warm-100')
html = html.replace('shadow-[0_0_25px_rgba(34,211,238,0.15)]', 'shadow-sm')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
