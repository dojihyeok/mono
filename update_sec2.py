import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hide "5가지 핵심 과제"
html = html.replace('<div class="reveal">\n      <div class="mt-16 mb-12">', '<div class="reveal hidden md:block">\n      <div class="mt-16 mb-12">')

# 2. Hide ESG 솔루션 킬러
html = html.replace('<div class="reveal mt-10  overflow-hidden group">', '<div class="reveal mt-10 hidden md:block overflow-hidden group">')

# 3. Hide Why Mono Matters ESG
html = html.replace('<div id="why-mono-matters-esg" class="reveal mt-10 mb-12  overflow-hidden group text-ink-900">', '<div id="why-mono-matters-esg" class="reveal mt-10 mb-12 hidden md:block overflow-hidden group text-ink-900">')

# 4. Hide 3 Message Cards
html = html.replace('<div class="grid md:grid-cols-3 gap-6 stagger mt-4">', '<div class="hidden md:grid md:grid-cols-3 gap-6 stagger mt-4">')

mobile_cards = """
    <!-- Mobile Only: 4 Simple Problem Cards (from mono_test.html) -->
    <div class="block md:hidden grid grid-cols-1 gap-4 mt-8 mb-12">
      <h3 class="text-xl font-black text-ink-900 mb-2">대한민국 산업 경쟁력 위기 4대 지표</h3>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-2">
        <div class="text-tech-700 text-sm font-bold flex items-center gap-2">
          <i class="fa-solid fa-user-slash"></i> 숙련 기술자 고령화
        </div>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">현장을 지탱하던 50대 이상의 숙련공들이 빠르게 은퇴하며 노하우 손실이 급증하고 있습니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-2">
        <div class="text-tech-700 text-sm font-bold flex items-center gap-2">
          <i class="fa-solid fa-person-falling-burst"></i> 청년 기술자 감소
        </div>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">가혹하고 위험한 노동 환경으로 인해 2030 젊은 층의 일터 진입률이 매년 급감하는 상황입니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-2">
        <div class="text-tech-700 text-sm font-bold flex items-center gap-2">
          <i class="fa-solid fa-globe"></i> 외국인 인력 증가
        </div>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">부족한 내국인 자리를 메우는 외국인 근로자들의 소통 장벽과 비자 수속 비효율이 극대화되고 있습니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-2">
        <div class="text-tech-700 text-sm font-bold flex items-center gap-2">
          <i class="fa-solid fa-layer-group"></i> 기술 전수 체계 부족
        </div>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">현장 장인들의 숙련 기술을 공식적인 매뉴얼이나 시스템으로 축적할 수 있는 표준 디지털 망이 부재합니다.</p>
      </div>
    </div>
"""

# Insert before Closing Message Box
if '<!-- Closing Message Box -->' in html:
    html = html.replace('<!-- Closing Message Box -->', mobile_cards + '\n      <!-- Closing Message Box -->')
else:
    print("Could not find the target for insertion.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 2 mobile update applied.")
