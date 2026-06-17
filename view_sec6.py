import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('MONO 브랜드 철학')
print(html[start-500:start+2500])
