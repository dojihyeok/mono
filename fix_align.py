with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix 1
target1 = """<p class="text-[17px] md:text-[19px] lg:text-[21px] text-ink-800 font-bold leading-[1.7] mb-6" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 기록되며,<br class="hidden md:block">
          그 경험이 더 좋은 일자리와 성장 기회, 금융 혜택, 글로벌 기회, 그리고 미래 기술의 기반이 될 수 있도록 연결합니다.
        </p>
        <p class="text-xl md:text-2xl lg:text-3xl font-black text-tech-700" style="word-break: keep-all;">
          우리는 기술자의 경험이 개인의 경력을 넘어 대한민국 산업의 자산이 되는 세상을 만들고자 합니다.
        </p>"""

replacement1 = """<p class="text-[17px] md:text-[19px] lg:text-[21px] text-ink-800 font-bold leading-[1.7] mb-6 text-justify" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 기록되며, 그 경험이 더 좋은 일자리와 성장 기회, 금융 혜택, 글로벌 기회, 그리고 미래 기술의 기반이 될 수 있도록 연결합니다.
        </p>
        <p class="text-xl md:text-2xl lg:text-3xl font-black text-tech-700 text-justify" style="word-break: keep-all;">
          우리는 기술자의 경험이 개인의 경력을 넘어 대한민국 산업의 자산이 되는 세상을 만들고자 합니다.
        </p>"""

if target1 in html:
    html = html.replace(target1, replacement1)
    print("Fixed target1")
else:
    print("Could not find target1")

# Fix 2
target2 = '<h3 class="text-2xl md:text-3xl font-black text-ink-900 mt-2">더 많은 기술자가 현장으로 올 수 있어야 합니다</h3>'
replacement2 = '<h3 class="text-xl sm:text-2xl md:text-3xl font-black text-ink-900 mt-2 text-justify" style="word-break: keep-all; letter-spacing: -0.05em;">더 많은 기술자가 현장으로 올 수 있어야 합니다</h3>'

if target2 in html:
    html = html.replace(target2, replacement2)
    print("Fixed target2")
else:
    print("Could not find target2")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
