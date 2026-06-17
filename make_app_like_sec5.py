import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_sec5_mobile = """    <!-- Mobile Only: Simplified BM -->
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
    </div>"""

new_sec5_mobile = """    <!-- Mobile Only: Simplified BM (App Style) -->
    <div class="block md:hidden space-y-4 mb-12 reveal">
      <!-- CORE BM -->
      <div class="bg-white border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex justify-between items-center bg-tech-50/50">
          <div class="text-ink-900 font-mono font-bold text-xs tracking-tight">CORE BM (핵심 수익)</div>
          <div class="w-2 h-2 rounded-full bg-tech-600"></div>
        </div>
        <div class="p-4">
          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-building-user text-tech-600 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">현장관리 SaaS & 정산</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-handshake text-tech-600 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">채용 및 인력 매칭</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-wallet text-tech-600 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">신용지갑 & 금융 연계</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- GROWTH BM -->
      <div class="bg-white border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex justify-between items-center bg-warm-50/50">
          <div class="text-tech-500 font-mono font-bold text-xs tracking-tight">GROWTH BM (중장기)</div>
          <div class="w-2 h-2 rounded-full bg-tech-400"></div>
        </div>
        <div class="p-4">
          <ul class="space-y-4">
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-person-chalkboard text-tech-500 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">교육 및 주거 플랫폼</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-id-badge text-tech-500 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">복지 멤버십 (Pass)</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="bg-warm-100 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i class="fa-solid fa-globe text-tech-500 text-xs"></i>
              </div>
              <span class="text-[14px] font-bold text-ink-900 tracking-tight">외국인 인력 통합 관리</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- FUTURE BM -->
      <div class="bg-white border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex justify-between items-center bg-warm-50/50">
          <div class="text-ink-800 font-mono font-bold text-xs tracking-tight">FUTURE BM (미래 가치)</div>
          <div class="w-2 h-2 rounded-full bg-ink-900"></div>
        </div>
        <div class="p-4 flex flex-wrap gap-2">
          <span class="bg-warm-100 text-ink-900 text-[12px] px-3 py-1.5 font-bold rounded-full tracking-tight">신용 데이터</span>
          <span class="bg-warm-100 text-ink-900 text-[12px] px-3 py-1.5 font-bold rounded-full tracking-tight">AI 현장 비서</span>
          <span class="bg-warm-100 text-ink-900 text-[12px] px-3 py-1.5 font-bold rounded-full tracking-tight">Tech Pension</span>
          <span class="bg-warm-100 text-ink-900 text-[12px] px-3 py-1.5 font-bold rounded-full tracking-tight">협업 로봇</span>
          <span class="bg-warm-100 text-ink-900 text-[12px] px-3 py-1.5 font-bold rounded-full tracking-tight">EaaS 구독</span>
        </div>
      </div>
    </div>"""

if old_sec5_mobile in html:
    html = html.replace(old_sec5_mobile, new_sec5_mobile)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Applied native app style to Section 05.")
else:
    print("Section 05 old mobile view not found.")
