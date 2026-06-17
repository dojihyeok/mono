import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_bm_section = """<section id="bm" class="relative py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-4"><span class="num">05</span> MONO 비즈니스 모델 · Business Model</div>
      <h2 class="h-display text-ink-900 mb-4">기술자의 경험이 신뢰 데이터가 되는 모델</h2>
      <p class="body-lg text-ink-800 font-bold max-w-4xl leading-relaxed" style="word-break: keep-all;">"MONO는 기술자의 근무 경험을 신뢰 데이터로 축적하고, 이를 일자리·금융·교육·복지·미래 자산으로 연결하는 기술자 생애주기 플랫폼입니다."</p>
      
      <!-- Flow / Pipeline visual -->
      <div class="flex flex-wrap items-center gap-2 md:gap-4 mt-6 text-sm md:text-base font-bold font-mono tracking-tight text-ink-800">
        <span class="bg-warm-100 text-ink-800 px-3 py-1.5 rounded-sm border border-ink-900/10">사람</span>
        <i class="fa-solid fa-arrow-right text-ink-800"></i>
        <span class="bg-warm-100 text-ink-800 px-3 py-1.5 rounded-sm border border-ink-900/10">데이터</span>
        <i class="fa-solid fa-arrow-right text-ink-800"></i>
        <span class="bg-warm-100 text-ink-800 px-3 py-1.5 rounded-sm border border-ink-900/10">신뢰</span>
        <i class="fa-solid fa-arrow-right text-ink-800"></i>
        <span class="bg-warm-100 text-ink-800 px-3 py-1.5 rounded-sm border border-ink-900/10">금융</span>
        <i class="fa-solid fa-arrow-right text-ink-800"></i>
        <span class="bg-warm-50 text-ink-900 px-3 py-1.5 rounded-sm border border-ink-900">미래 기술</span>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">
      <!-- 1. Core BM -->
      <div class="bg-warm-100 border border-ink-200 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-700">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-ink-900/10">
          <div>
            <div class="text-ink-900 font-mono font-bold tracking-widest text-xs mb-1">CORE BM</div>
            <h3 class="text-2xl font-black text-ink-900">핵심 수익 구조</h3>
          </div>
          <span class="bg-safety-amber/20 text-ink-900 text-[10px] px-2 py-1 font-bold rounded">반드시 성공해야 하는 사업</span>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-building-user text-tech-600"></i> 현장관리 SaaS</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">기업용 출역/노무 관리 및 안전관리 플랫폼 구독료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-money-check-dollar text-tech-600"></i> 안심 정산</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">임금 체불을 막는 당일 정산 대행 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-handshake text-tech-600"></i> 채용 및 인력 매칭</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">검증된 기술자 채용 및 정규직 전환 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-id-card-clip text-tech-600"></i> 기술자 경력관리 (MONO Wallet)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">근무기록, 교육이력, 자격증, 평판을 하나로 관리하는 신용지갑 구축 (기업 열람권)</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-wallet text-tech-600"></i> 금융 연계</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">금융기관 API를 통한 대출 및 보험 연계 수수료</p>
          </div>
        </div>
      </div>

      <!-- 2. Growth BM -->
      <div class="bg-warm-100 border border-ink-900/20 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-500">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-ink-900/10">
          <div>
            <div class="text-tech-500 font-mono font-bold tracking-widest text-xs mb-1">GROWTH BM</div>
            <h3 class="text-2xl font-black text-ink-900">중장기 (3~5년)</h3>
          </div>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-person-chalkboard text-tech-500"></i> 교육 플랫폼</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">현장 기술 전수 및 자격증 교육 마켓플레이스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-bed text-tech-500"></i> 주거/숙박 플랫폼</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">기술자 전용 숙소 예약, 기업 계약 및 모듈형 숙소 운영</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-id-badge text-tech-500"></i> 복지 멤버십 (MONO Pass)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">식당, 헬스장, 숙소, 작업복, 보험, 나아가 가족 복지(자녀 교육, 여행)까지 포함하는 구독 서비스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-truck-moving text-tech-500"></i> 장비 공유 & 현장 물류</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">공구/안전장비 중고 거래(커뮤니티 마켓) 및 자재 운송 중개 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-globe text-tech-500"></i> 외국인 기술자 플랫폼</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">외국인 인력 사전 검증, 채용 매칭, 비자 전환 지원 등 전 생애주기 통합 수수료</p>
          </div>
        </div>
      </div>

      <!-- 3. Future BM -->
      <div class="bg-warm-100 border border-ink-900/20 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-ink-900">
        <div class="absolute top-0 right-0 w-32 h-32 bg-tech-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-tech-800/50">
          <div>
            <div class="text-ink-800 font-mono font-bold tracking-widest text-xs mb-1">FUTURE BM</div>
            <h3 class="text-2xl font-black text-ink-900">미래 가치 (5년 이상)</h3>
          </div>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-database text-tech-600"></i> 신용 데이터 사업</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">누적된 근무·안전 평가를 대형 금융기관 및 보험사에 제공하여 새로운 신용평가 지표 생성</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-headset text-tech-600"></i> AI 현장 비서</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">작업자 맞춤형 공법 안내 및 실시간 안전 가이드 구독 서비스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-network-wired text-tech-600"></i> Tech-Blue</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">근로자 생체 데이터 파이프라인 및 디지털 헬스케어 융합</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-robot text-tech-600"></i> 협업 로봇 (RaaS)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">현장 데이터 기반 구독형 모듈 로봇 임대로 고위험 노동 상쇄</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-piggy-bank text-tech-600"></i> 기술자 자산운용 (Tech Pension)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">근무 활동 데이터를 포인트로 적립하여 장비, 교육, 그리고 은퇴 후 미래 자산으로 전환하는 기술자 연금 플랫폼</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>"""

# Replace the entire section by matching <section id="bm" ... </section>
pattern = re.compile(r'<section id="bm".*?</section>', re.DOTALL)
html = pattern.sub(new_bm_section, html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Replaced whole BM section.")
