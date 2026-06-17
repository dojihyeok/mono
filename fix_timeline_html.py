import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update vtimeline container
html = html.replace('<div class="vtimeline pl-16 lg:pl-20 space-y-8 reveal">', '<div class="vtimeline pl-0 md:pl-16 lg:pl-20 space-y-6 md:space-y-8 reveal">')

# Update article padding to save space on mobile
html = html.replace('<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">', '<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">')

# Let's also adjust the chip inside the article to not have mb-3 if it's too much, but mb-3 is small enough.
with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated timeline HTML.")
