import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<section id="bm"')
end = html.find('</section>', start)

print(html[start:start+1500])
