import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all bg-white with bg-warm-100
html = html.replace('bg-white', 'bg-warm-100')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced all bg-white with bg-warm-100")
