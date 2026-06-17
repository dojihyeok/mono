import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make the 4-card grid hidden on mobile
html = html.replace('<div class="grid md:grid-cols-2 gap-6 mb-16">', '<div class="hidden md:grid md:grid-cols-2 gap-6 mb-16">')

mobile_summary_sec2 = """
      <!-- Mobile Only: 02 Summary -->
      <div class="block md:hidden mb-12 bg-warm-100 border border-ink-900/15 p-6 lcorner shadow-sm relative overflow-hidden">
        <h3 class="text-lg font-black text-ink-900 mb-4" style="word-break:keep-all;">기술자 경험의 자산화 플라이휠</h3>
        <ul class="space-y-4">
          <li class="flex gap-3">
            <span class="text-tech-600 font-bold">01</span>
            <div>
              <p class="font-bold text-ink-900 text-sm">파편화된 기록의 신뢰 데이터화</p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="text-tech-600 font-bold">02</span>
            <div>
              <p class="font-bold text-ink-900 text-sm">개인의 성장이 산업의 경쟁력으로</p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="text-tech-600 font-bold">03</span>
            <div>
              <p class="font-bold text-ink-900 text-sm">외국인 인력의 체계적인 통합</p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="text-tech-600 font-bold">04</span>
            <div>
              <p class="font-bold text-ink-900 text-sm">현장 맞춤형 장비와 미래 기술 연계</p>
            </div>
          </li>
        </ul>
      </div>
"""

# Insert mobile summary before the hidden desktop grid
html = html.replace('<div class="hidden md:grid md:grid-cols-2 gap-6 mb-16">', mobile_summary_sec2 + '<div class="hidden md:grid md:grid-cols-2 gap-6 mb-16">')

# Hide the detailed problem list on mobile
html = html.replace('<h3 class="text-2xl md:text-3xl font-black text-ink-900 mb-8"', '<h3 class="hidden md:block text-2xl md:text-3xl font-black text-ink-900 mb-8"')
html = html.replace('<div class="grid gap-6">', '<div class="hidden md:grid gap-6">')

mobile_problem_list = """
      <!-- Mobile Only: Problem List Summary -->
      <div class="block md:hidden">
        <h3 class="text-xl font-black text-ink-900 mb-6" style="word-break:keep-all;">현장이 직면한 핵심 과제와 해결책</h3>
        <div class="space-y-3">
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 객관적인 기술 경력 증빙의 어려움</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 위변조 불가능한 블록체인 신뢰 이력서 제공</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 기술 전수 단절과 외국인 기술자 관리 체계 부재</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 외국인 기술자 맞춤형 인증 및 멘토링 연계</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 기술자에 대한 금융 불이익</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 근무 및 안전 데이터 기반 금융 혜택 모델(Tech-Fi)</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 고위험 반복 작업에 따른 인력 이탈</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 데이터 기반 스마트 안전장비 및 로보틱스 연계</p>
          </div>
        </div>
      </div>
"""

# Insert mobile problem list before the hidden desktop grid
html = html.replace('<div class="hidden md:grid gap-6">', mobile_problem_list + '<div class="hidden md:grid gap-6">')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 02 mobile view implemented.")
