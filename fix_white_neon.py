import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the white backgrounds
html = html.replace('bg-white', 'bg-warm-100/50')

# Fix the neon circles in the mobile view
html = html.replace('bg-tech-100 w-6 h-6', 'bg-ink-900/10 w-6 h-6')
# Find the specific icons inside those circles:
# <i class="fa-solid fa-check text-tech-600 text-[10px]"></i>
html = html.replace('<i class="fa-solid fa-check text-tech-600 text-[10px]"></i>', '<i class="fa-solid fa-check text-ink-900 text-[10px]"></i>')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
