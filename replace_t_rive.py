with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """      <div class="w-full mx-auto mb-8 px-8 lg:px-12">
        <p class="text-[17px] md:text-xl lg:text-[22px] text-ink-800 font-semibold leading-[1.8] text-center break-keep">
          우리는 사람을 대체하는 기술이 아니라, 사람의 가치를 증명하고 보호하는 기술(Human-Centric Technology)을 만듭니다.<br class="hidden md:block" />
          기술노동자의 땀방울이 온전한 데이터 자산으로 인정받는 세상을 향해 <strong>T-Rive 팀</strong>이 함께합니다.
        </p>
      </div>
      <a href="mailto:contact@t-rive.io" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-50 border border-ink-900/20 text-ink-900 font-bold hover:bg-warm-50 hover:text-ink-900 transition-colors rounded-lg shadow-sm group">
        <i class="fa-solid fa-envelope text-tech-600 group-hover:text-ink-800"></i> 팀과 대화하기
      </a>"""

replacement = """      <div class="w-full mx-auto mb-8 px-8 lg:px-12">
        <p class="text-[17px] md:text-xl lg:text-[22px] text-ink-800 font-semibold leading-[1.8] text-center break-keep">
          우리는 사람을 대체하는 기술이 아니라, 사람의 가치를 증명하고 보호하는 기술(Human-Centric Technology)을 만듭니다.<br class="hidden md:block" />
          기술노동자의 땀방울이 온전한 데이터 자산으로 인정받는 세상을 향해 <strong>T-Rive 팀</strong>이 함께합니다.
        </p>
      </div>

      <div class="flex flex-col items-center gap-4">
        <div class="bg-warm-50 border border-ink-900/10 rounded-lg p-5 md:p-6 max-w-xl mx-auto shadow-sm text-left mb-2">
          <p class="text-sm md:text-base text-ink-700 leading-relaxed mb-4" style="word-break: keep-all;">
            <strong>MONO는 T-Rive가 만들어가는 첫 번째 플랫폼입니다.</strong><br>
            T-Rive는 사람들이 자신의 경험과 전문성을 바탕으로 성장할 수 있도록 돕습니다.<br>
            T-Rive의 철학과 이야기가 궁금하다면 Creator 페이지에서 확인할 수 있습니다.
          </p>
          <a href="https://dojiung.com/creator/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-tech-700 font-bold hover:text-tech-900 transition-colors">
            Creator 페이지 방문하기 <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>

        <a href="mailto:contact@t-rive.io" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-50 border border-ink-900/20 text-ink-900 font-bold hover:bg-warm-100 hover:text-ink-900 transition-colors rounded-lg shadow-sm group">
          <i class="fa-solid fa-envelope text-tech-600 group-hover:text-ink-800"></i> 팀과 대화하기
        </a>
      </div>"""

if target in html:
    html = html.replace(target, replacement)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Success")
else:
    print("Target not found")
