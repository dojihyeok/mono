import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<section id="vision"')
end = html.find('<!-- footer -->', start)
print(html[start:end])
