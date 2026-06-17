import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Using regex to find <section id="global-pipeline"> to the next </section>
s6_pattern = re.compile(r'<!-- ============================== S6 · GLOBAL PIPELINE ============================== -->\s*<div class="tape-divider"></div>\s*<section id="global-pipeline".*?</section>', re.DOTALL)
html = s6_pattern.sub('', html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 6 deleted.")
