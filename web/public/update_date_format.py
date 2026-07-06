import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('2026.05–07', '2026.05 ~ 2026.07')
html = html.replace('2026.08–09', '2026.08 ~ 2026.09')
html = html.replace('2026.10–11', '2026.10 ~ 2026.11')
html = html.replace('2026.12–', '2026.12 ~')

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Dates format updated.")
