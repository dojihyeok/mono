import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Flow pipeline modification
html = html.replace('<div class="flex flex-wrap items-center gap-2 md:gap-4 mt-6 text-sm md:text-base font-bold font-mono tracking-tight text-ink-800">', 
                    '<div class="hidden md:flex flex-wrap items-center gap-2 md:gap-4 mt-6 text-sm md:text-base font-bold font-mono tracking-tight text-ink-800">')

mobile_flow = """
      <!-- Mobile Only: Vertical Flow -->
      <div class="block md:hidden mt-6 bg-warm-100 border border-ink-900/10 p-5 lcorner shadow-sm">
        <ul class="space-y-3 font-mono font-bold text-sm text-ink-800">
          <li class="flex items-center gap-3"><i class="fa-solid fa-user text-tech-600 w-4"></i> 사람 (기술자)</li>
          <li class="flex items-center gap-3"><i class="fa-solid fa-arrow-down text-ink-400 w-4"></i></li>
          <li class="flex items-center gap-3"><i class="fa-solid fa-database text-tech-600 w-4"></i> 데이터 축적</li>
          <li class="flex items-center gap-3"><i class="fa-solid fa-arrow-down text-ink-400 w-4"></i></li>
          <li class="flex items-center gap-3"><i class="fa-solid fa-shield-halved text-tech-600 w-4"></i> 신뢰 및 금융</li>
          <li class="flex items-center gap-3"><i class="fa-solid fa-arrow-down text-ink-400 w-4"></i></li>
          <li class="flex items-center gap-3 text-ink-900"><i class="fa-solid fa-robot text-tech-600 w-4"></i> 미래 기술 기반</li>
        </ul>
      </div>
"""

# Find where to insert mobile_flow
flow_end_idx = html.find('</div>\n    </div>\n\n    <div class="grid lg:grid-cols-3')
if flow_end_idx != -1:
    html = html[:flow_end_idx+6] + mobile_flow + html[flow_end_idx+6:]

# 2. BM Grid modification
html = html.replace('<div class="grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">', 
                    '<div class="hidden md:grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">')

mobile_bm = """
    <!-- Mobile Only: Simplified BM -->
    <div class="block md:hidden space-y-6 mb-12 reveal">
      <!-- CORE BM -->
      <div class="bg-warm-100 border border-ink-200 border-t-4 border-t-tech-700 lcorner p-5 shadow-sm">
        <div class="text-ink-900 font-mono font-bold text-xs mb-1">CORE BM (핵심 수익 구조)</div>
        <ul class="space-y-3 mt-4">
          <li class="text-[13px] font-bold"><i class="fa-solid fa-building-user text-tech-600 w-5"></i>현장관리 SaaS & 안심 정산</li>
          <li class="text-[13px] font-bold"><i class="fa-solid fa-handshake text-tech-600 w-5"></i>채용 및 인력 매칭</li>
          <li class="text-[13px] font-bold"><i class="fa-solid fa-wallet text-tech-600 w-5"></i>신용지갑 & 금융 연계</li>
        </ul>
      </div>
      <!-- GROWTH BM -->
      <div class="bg-warm-100 border border-ink-200 border-t-4 border-t-tech-500 lcorner p-5 shadow-sm">
        <div class="text-tech-500 font-mono font-bold text-xs mb-1">GROWTH BM (중장기)</div>
        <ul class="space-y-3 mt-4">
          <li class="text-[13px] font-bold"><i class="fa-solid fa-person-chalkboard text-tech-500 w-5"></i>교육 및 주거 플랫폼</li>
          <li class="text-[13px] font-bold"><i class="fa-solid fa-id-badge text-tech-500 w-5"></i>복지 멤버십 (MONO Pass)</li>
          <li class="text-[13px] font-bold"><i class="fa-solid fa-globe text-tech-500 w-5"></i>외국인 기술자 통합 관리</li>
        </ul>
      </div>
      <!-- FUTURE BM -->
      <div class="bg-warm-100 border border-ink-200 border-t-4 border-t-ink-900 lcorner p-5 shadow-sm">
        <div class="text-ink-800 font-mono font-bold text-xs mb-1">FUTURE BM (미래 가치)</div>
        <div class="flex flex-wrap gap-2 mt-4">
          <span class="bg-warm-200 text-ink-900 text-[11px] px-2 py-1 font-bold rounded-sm border border-ink-900/10">신용 데이터</span>
          <span class="bg-warm-200 text-ink-900 text-[11px] px-2 py-1 font-bold rounded-sm border border-ink-900/10">AI 현장 비서</span>
          <span class="bg-warm-200 text-ink-900 text-[11px] px-2 py-1 font-bold rounded-sm border border-ink-900/10">Tech Pension</span>
          <span class="bg-warm-200 text-ink-900 text-[11px] px-2 py-1 font-bold rounded-sm border border-ink-900/10">협업 로봇 (RaaS)</span>
          <span class="bg-warm-200 text-ink-900 text-[11px] px-2 py-1 font-bold rounded-sm border border-ink-900/10">EaaS 구독</span>
        </div>
      </div>
    </div>
"""

# Insert mobile_bm before the hidden desktop grid
html = html.replace('<div class="hidden md:grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">', 
                    mobile_bm + '<div class="hidden md:grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 05 mobile view implemented.")
