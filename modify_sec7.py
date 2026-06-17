import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Hide the evolution image on mobile
target = '<div class="mt-12 mb-4 relative z-10 w-full overflow-hidden lcorner border border-ink-900/15 shadow-blueprint bg-white">'
replacement = '<div class="hidden md:block mt-12 mb-4 relative z-10 w-full overflow-hidden lcorner border border-ink-900/15 shadow-blueprint bg-white">'

if target in html:
    html = html.replace(target, replacement)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Section 07 mobile view implemented.")
else:
    print("Target not found.")

