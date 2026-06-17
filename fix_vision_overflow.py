import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_sec = 'id="vision" class="relative py-16 md:py-24 lg:py-32 bg-warm-50 text-ink-900 overflow-hidden"'
new_sec = 'id="vision" class="relative py-16 md:py-24 lg:py-32 bg-warm-50 text-ink-900"'

if old_sec in html:
    html = html.replace(old_sec, new_sec)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Removed overflow-hidden from vision section.")
else:
    print("Could not find exact string for vision section.")

