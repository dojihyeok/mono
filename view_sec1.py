import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<section id="platform"')
end = html.find('<section id="problem"', start)
print(html[start:start+1500])
