with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<section id="gtm"')
end = html.find('<!-- S5 · BM -->', start)
print(html[end-1000:end])
