import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<!-- Closing Message Box -->')
print(html[start:start+1000])
