import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure we don't have broken tags or remaining text-ink-700/60
html = html.replace('text-ink-700/60', 'text-ink-500')
html = html.replace('bg-tech-50', 'bg-warm-50')
html = html.replace('bg-tech-100', 'bg-warm-200')
html = html.replace('bg-tech-700 border border-ink-900/15', 'bg-warm-100 border border-ink-900/15')

# specifically for card 4
html = html.replace('<h3 class="text-xl font-extrabold text-ink-900 mt-1"', '<h3 class="text-xl font-extrabold text-ink-900 mt-1"')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
