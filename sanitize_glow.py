import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace specific classes
html = html.replace('text-cyber-glow', 'text-tech-600')
html = html.replace('hyper-glow-box', '')
html = re.sub(r'<div class="glow-sphere[^>]*></div>', '', html)
html = html.replace('shadow-[0_0_12px_rgba(34,211,238,0.3)]', 'shadow-sm')
html = html.replace('shadow-[0_0_15px_rgba(34,211,238,0.15)]', 'shadow-sm')
html = html.replace('shadow-[0_0_15px_rgba(14,116,144,0.15)]', 'shadow-sm')

# Let's also check if there are any remaining dark bg classes like bg-ink-900 that shouldn't be there
# We changed section 07, but let's make sure the rest is clean
# Actually, the user specifically mentioned section 07's dark background in the screenshot, which we fixed.

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
