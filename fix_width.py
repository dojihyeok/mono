with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """    <div class="max-w-4xl mx-auto text-center mb-16 reveal">
      <div class="section-label mb-4"><span class="num">07</span> Next MONO : 현장 맞춤형 Tech-Blue 인프라</div>
      <h2 class="h-display text-ink-900 leading-tight tracking-tight mb-6" style="word-break: keep-all;">
        기술자의 경험은 사라져야 할 노동이 아니라,<br class="hidden md:block" />
        <span class="text-tech-600">다음 세대 산업을 움직이는 자산</span>입니다.
      </h2>
      <p class="body-lg text-ink-700" style="word-break: keep-all;">
        MONO는 기술자의 경험과 숙련을 기록하고 연결하여 더 안전한 현장, 더 나은 성장 기회, 그리고 대한민국 산업 경쟁력의 미래를 만들어 갑니다.
      </p>
      <!-- Evolution diagram image from previous step -->
      <div class="mt-8 relative w-full rounded-lg overflow-hidden border border-ink-900/15 shadow-2xl">
        <img src="images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-cover" />
      </div>
    </div>"""

replacement = """    <div class="max-w-6xl mx-auto mb-16 reveal text-center">
      <div class="max-w-5xl mx-auto">
        <div class="section-label mb-4"><span class="num">07</span> Next MONO : 현장 맞춤형 Tech-Blue 인프라</div>
        <h2 class="h-display text-ink-900 leading-tight tracking-tight mb-6" style="word-break: keep-all;">
          기술자의 경험은 사라져야 할 노동이 아니라,<br class="hidden md:block" />
          <span class="text-tech-600">다음 세대 산업을 움직이는 자산</span>입니다.
        </h2>
        <p class="body-lg text-ink-700" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련을 기록하고 연결하여 더 안전한 현장, 더 나은 성장 기회, 그리고 대한민국 산업 경쟁력의 미래를 만들어 갑니다.
        </p>
      </div>
      <!-- Evolution diagram image from previous step -->
      <div class="mt-8 relative w-full rounded-lg overflow-hidden border border-ink-900/15 shadow-2xl">
        <img src="images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-cover" />
      </div>
    </div>"""

if target in html:
    html = html.replace(target, replacement)
    print("Fixed target!")
else:
    print("Could not find target!")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
