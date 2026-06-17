with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Delete the <p> tag
p_tag = '<p class="body-lg mt-5 max-w-3xl">라운드마다 자금 규모·돌파 액션·규제 대응을 하나의 도면 위에 정렬했습니다. <span class="mono text-ink-900">4,000 → 500 → 200 → 100 → 5</span>, 4단계 라운드를 단계별로 열어 보세요.</p>'
if p_tag in html:
    html = html.replace(p_tag, '')
    print("Removed <p> tag.")
else:
    print("Could not find <p> tag.")

# 2. Change the bg-warm-100 of the cards in the screenshot to bg-warm-100/40 or bg-warm-50
card1 = '<div class="bg-warm-100 border border-ink-900/10 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">'
card1_new = '<div class="bg-warm-50 border border-ink-900/10 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">'
html = html.replace(card1, card1_new)

container = '<div class="lg:col-span-7 bg-warm-100 border border-ink-900/10 p-6 md:p-10 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">'
container_new = '<div class="lg:col-span-7 bg-warm-50 border border-ink-900/10 p-6 md:p-10 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">'
html = html.replace(container, container_new)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated backgrounds.")
