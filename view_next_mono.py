import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<div class="section-label mb-4"><span class="num">07</span> Next MONO')
print(html[start:start+1000])
