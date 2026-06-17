with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Remove R1-, R2-, R3-, R4- from chips
html = html.replace('>R1-지역 예선<', '>지역 예선<')
html = html.replace('>R2-지역 오디션<', '>지역 오디션<')
html = html.replace('>R3-권역 오디션<', '>권역 오디션<')
html = html.replace('>R4-전국 오디션<', '>전국 오디션<')

# Remove bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm
# I will replace it with just p-0 or keep p-6 but remove background and borders.
# Let's replace 'bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm' with 'p-0'
html = html.replace('bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm', 'md:pl-6')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
