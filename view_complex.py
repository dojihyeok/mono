import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's count sections and note what's in them to plan mobile optimization
sections = re.findall(r'<section id="(.*?)"', html)
print("Sections found:", sections)
