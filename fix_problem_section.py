import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_problem_section = """<section id="problem" class="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label text-xl md:text-2xl font-black mb-6"><span class="num text-[16px] md:text-[18px] px-3 py-1">02</span> MONO가 만들고 싶은 변화</div>
      <h2 class="h-display text-ink-900" style="word-break: keep-all; ">대한민국 산업 경쟁력의 핵심인 기술과 숙련이 다음 세대로 이어질 수 있도록</h2>
    </div>

    <div class="reveal">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Card 1 -->
        <div class="bg-warm-100 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
          <div class="mb-4">
            <span class="text-ink-500 font-mono font-bold text-sm">01</span>
            <h3 class="text-xl font-extrabold text-ink-900 mt-1" style="word-break:keep-all;">대한민국 산업 경쟁력의 기반</h3>
          </div>
          <p class="body-md text-ink-700 leading-relaxed" style="word-break:keep-all;">
            현재 대한민국은 조선, 건설, 플랜트, 반도체, 방산 등 세계적인 산업 경쟁력을 보유하고 있습니다.<br><br>
            하지만 이러한 경쟁력은 수십 년 동안 현장을 지켜온 기술자들의 경험과 숙련 위에서 만들어졌습니다.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="bg-warm-100 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
          <div class="mb-4">
            <span class="text-ink-500 font-mono font-bold text-sm">02</span>
            <h3 class="text-xl font-extrabold text-ink-900 mt-1" style="word-break:keep-all;">산업 현장의 구조적 변화</h3>
          </div>
          <p class="body-md text-ink-700 leading-relaxed" style="word-break:keep-all;">
            현재 산업 현장은 숙련 기술자의 고령화, 청년 기술자 감소, 외국인 인력 비중 증가라는 구조적 변화를 겪고 있습니다.<br><br>
            외국인 기술자는 이미 산업 현장의 중요한 구성원이 되었지만, 기술 전수와 경력 관리 체계는 아직 충분하지 않습니다. 반면 청년층은 기술직의 성장 가능성과 미래 비전을 체감하지 못해 현장 유입이 감소하고 있습니다.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="bg-warm-100 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
          <div class="mb-4">
            <span class="text-ink-500 font-mono font-bold text-sm">03</span>
            <h3 class="text-xl font-extrabold text-ink-900 mt-1" style="word-break:keep-all;">사라지는 기술과 경험</h3>
          </div>
          <p class="body-md text-ink-700 leading-relaxed" style="word-break:keep-all;">
            현장의 경험과 숙련은 대한민국 산업의 중요한 자산입니다.<br><br>
            그러나 현재는 기술자의 경력이 체계적으로 관리되지 않고, 경험과 노하우가 기록되지 않으며, 은퇴와 함께 기술이 사라지고 있습니다. 기술 전수가 단절되면 산업 경쟁력 역시 약화될 수 있습니다.
          </p>
        </div>

        <!-- Card 4 -->
        <div class="bg-tech-700 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
          <div class="absolute inset-0 blueprint opacity-20 pointer-events-none"></div>
          <div class="mb-4 relative z-10">
            <span class="text-warm-100/60 font-mono font-bold text-sm">04</span>
            <h3 class="text-xl font-extrabold text-warm-50 mt-1" style="word-break:keep-all;">MONO가 만들고 싶은 변화</h3>
          </div>
          <p class="body-md text-warm-100 leading-relaxed relative z-10" style="word-break:keep-all;">
            MONO는 기술자의 경험과 경력을 신뢰할 수 있는 데이터로 기록하고 연결합니다.<br><br>
            기술자는 자신의 경험을 자산으로 만들고, 기업은 검증된 인재를 확보하며, 내국인과 외국인 기술자는 함께 성장할 수 있습니다. 또한 현장의 기술과 숙련이 다음 세대로 이어질 수 있는 기반을 구축합니다.
          </p>
        </div>
      </div>

      <!-- Closing Message Box -->
      <div class="mt-8 p-8 md:p-10 bg-warm-100 border border-ink-900/15 lcorner shadow-neo-soft relative overflow-hidden text-center max-w-4xl mx-auto">
        <i class="fa-solid fa-quote-left text-3xl text-ink-200 mb-6 block"></i>
        <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-6" style="word-break: keep-all; line-height: 1.4;">
          대한민국 산업의 경쟁력은 기술자에게서 시작됩니다.
        </h4>
        <p class="text-[15px] md:text-[17px] text-ink-800 font-bold leading-relaxed mb-6" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 기록되며,<br class="hidden md:block">
          그 경험이 더 좋은 일자리와 성장 기회, 금융 혜택, 그리고 미래 기술의 기반이 될 수 있도록 연결합니다.
        </p>
        <p class="text-lg md:text-xl font-black text-tech-700" style="word-break: keep-all;">
          우리는 기술자의 경험이 개인의 경력을 넘어 산업의 자산이 되는 세상을 만들고자 합니다.
        </p>
      </div>

    </div>
  </div>
</section>"""

pattern = re.compile(r'<section id="problem".*?</section>', re.DOTALL)
html = pattern.sub(new_problem_section, html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Problem section rewritten.")
