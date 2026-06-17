with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('border border border-ink-900/10', 'border border-ink-900/15')
html = html.replace('bg-warm-100 border border-ink-900/15 shadow-sm', 'bg-warm-50 border border-ink-900/15 shadow-sm')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
