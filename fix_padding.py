import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_sec = '<section id="platform" class="relative pt-12 sm:pt-16 md:pt-24 lg:pt-28 pb-14 sm:pb-20 md:pb-24 lg:pb-32 bg-warm-50">'
new_sec = '<section id="platform" class="relative pt-24 sm:pt-28 md:pt-32 lg:pt-32 pb-14 sm:pb-20 md:pb-24 lg:pb-32 bg-warm-50">'

if old_sec in html:
    html = html.replace(old_sec, new_sec)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed first section top padding.")
else:
    print("Could not find exact string for first section.")

