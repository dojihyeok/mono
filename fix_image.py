import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the next_mono_evolution image and add mix-blend-multiply
html = html.replace('class="w-full h-auto object-cover" loading="lazy"', 'class="w-full h-auto object-cover mix-blend-multiply" loading="lazy"')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Image blend mode applied.")
