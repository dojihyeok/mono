import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_bm = """<!-- ============================== S5 · BM ============================== -->
<section id="bm" class="relative py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-4"><span class="num">04</span> MONO 비즈니스 모델 · Business Model</div>
      <h2 class="h-display text-ink-900 mb-4">기술자의 경력 데이터가 자산이 되는 모델</h2>
      
      <!-- Flow / Pipeline visual -->
      <div class="flex flex-wrap items-center gap-2 md:gap-4 mt-6 text-sm md:text-base font-bold font-mono tracking-tight text-ink-800">
        <span class="bg-tech-100 text-tech-800 px-3 py-1.5 rounded-sm border border-tech-200">사람</span>
        <i class="fa-solid fa-arrow-right text-tech-400"></i>
        <span class="bg-tech-100 text-tech-800 px-3 py-1.5 rounded-sm border border-tech-200">데이터</span>
        <i class="fa-solid fa-arrow-right text-tech-400"></i>
        <span class="bg-tech-100 text-tech-800 px-3 py-1.5 rounded-sm border border-tech-200">신뢰</span>
        <i class="fa-solid fa-arrow-right text-tech-400"></i>
        <span class="bg-tech-100 text-tech-800 px-3 py-1.5 rounded-sm border border-tech-200">금융</span>
        <i class="fa-solid fa-arrow-right text-tech-400"></i>
        <span class="bg-tech-700 text-warm-50 px-3 py-1.5 rounded-sm border border-tech-800">미래 기술</span>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">
      <!-- 1. Core BM -->
      <div class="bg-warm-100 border border-tech-700/20 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-700">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-ink-900/10">
          <div>
            <div class="text-tech-700 font-mono font-bold tracking-widest text-xs mb-1">CORE BM</div>
            <h3 class="text-2xl font-black text-ink-900">초기 핵심 수익 구조</h3>
          </div>
          <span class="bg-safety-amber/20 text-ink-900 text-[10px] px-2 py-1 font-bold rounded">우선순위 1</span>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-building-user text-tech-600"></i> 기업용 현장관리 SaaS</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">구독료 기반 출역/노무 관리. 안전관리 플랫폼 및 기업 전용 인재풀 제공 (가장 확실한 캐시카우)</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-money-check-dollar text-tech-600"></i> 안심 정산 서비스</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">임금 체불을 막는 당일 정산 대행 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-handshake text-tech-600"></i> 채용 및 인재 매칭</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">검증된 기술자 채용 및 정규직 전환 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-id-card-clip text-tech-600"></i> 기술자 인증 프로필</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">기업 열람권, 프리미엄 프로필. 이력서를 대체하는 공식 경력 데이터 플랫폼 (고마진/저비용)</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-wallet text-tech-600"></i> 기술자 금융 플랫폼</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">근무 기록 기반 대출/보험 중개 및 추천 (매우 높은 수익성)</p>
          </div>
        </div>
      </div>

      <!-- 2. Growth BM -->
      <div class="bg-warm-100 border border-tech-500/20 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-500">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-400/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-ink-900/10">
          <div>
            <div class="text-tech-500 font-mono font-bold tracking-widest text-xs mb-1">GROWTH BM</div>
            <h3 class="text-2xl font-black text-ink-900">중장기 (3~5년)</h3>
          </div>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-globe text-tech-500"></i> 외국인 기술자 통합 지원</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">E-7-4, E-9 대상 채용 수수료, 비자/정착/통역 지원. 국내 인력난 구조적 해결의 핵심</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-person-chalkboard text-tech-500"></i> 기술 교육 마켓플레이스</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">현장 장인이 직접 타일, 미장 등을 강의하는 수수료. 기술 전수 생태계 구축</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-bed text-tech-500"></i> 기술자 전용 주거/숙박</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">장기 숙소 연결 및 모듈형 숙소 임대 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-id-badge text-tech-500"></i> 기술자 생활패스 (멤버십)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">식당, 헬스장, 상해보험 할인 구독 패스. 강력한 락인 효과</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-truck-moving text-tech-500"></i> 커뮤니티 & 현장 물류</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">공구/장비 중고 거래, 장비 대여, 자재 운송 중개</p>
          </div>
        </div>
      </div>

      <!-- 3. Future BM -->
      <div class="glass-dark border border-tech-400/30 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-tech-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-6 pb-4 border-b border-tech-800/50">
          <div>
            <div class="text-tech-400 font-mono font-bold tracking-widest text-xs mb-1">FUTURE BM</div>
            <h3 class="text-2xl font-black text-warm-50">미래 가치 (5년 이상)</h3>
          </div>
        </div>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-warm-100 mb-1 flex items-center gap-2"><i class="fa-solid fa-database text-tech-300"></i> 신용 데이터 사업</h4>
            <p class="text-[13px] text-warm-200 leading-relaxed">누적된 근무·안전 평가를 대형 금융기관/보험사에 제공</p>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1 flex items-center gap-2"><i class="fa-solid fa-piggy-bank text-tech-300"></i> 기술자 연금 (자산운용)</h4>
            <p class="text-[13px] text-warm-200 leading-relaxed">활동 데이터를 포인트로 적립하여 장비, 교육, 은퇴 자산으로 전환</p>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1 flex items-center gap-2"><i class="fa-solid fa-headset text-tech-300"></i> AI 현장 비서</h4>
            <p class="text-[13px] text-warm-200 leading-relaxed">작업자 맞춤형 공법 안내 및 안전 가이드 월 구독</p>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1 flex items-center gap-2"><i class="fa-solid fa-network-wired text-tech-300"></i> Tech-Blue & 로봇 (RaaS)</h4>
            <p class="text-[13px] text-warm-200 leading-relaxed">생체 데이터 파이프라인 및 구독형 협업 로봇 임대</p>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1 flex items-center gap-2"><i class="fa-solid fa-user-tie text-tech-300"></i> 은퇴 기술자 멘토링</h4>
            <p class="text-[13px] text-warm-200 leading-relaxed">은퇴 장인의 경험을 현장 컨설팅과 교육으로 전환</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 투자자 어필 포인트 (가장 MONO다운 BM 하이라이트) -->
    <div class="reveal mt-12 grid md:grid-cols-3 gap-6">
      <div class="bg-warm-100/50 border border-ink-900/10 p-5 rounded-sm">
        <h4 class="text-sm font-bold font-mono text-tech-700 mb-3 tracking-tight">가장 현실적인 BM</h4>
        <ul class="text-[13px] font-bold text-ink-900 space-y-1">
          <li>1. 기업용 현장관리 SaaS</li>
          <li>2. 안심 정산</li>
          <li>3. 채용 매칭</li>
          <li>4. 금융 중개</li>
          <li>5. 외국인 기술자 채용</li>
        </ul>
      </div>
      <div class="bg-warm-100/50 border border-ink-900/10 p-5 rounded-sm">
        <h4 class="text-sm font-bold font-mono text-tech-700 mb-3 tracking-tight">가장 큰 시장 BM</h4>
        <ul class="text-[13px] font-bold text-ink-900 space-y-1">
          <li>1. 금융 데이터</li>
          <li>2. 외국인 인력 플랫폼</li>
          <li>3. 안전관리 플랫폼</li>
        </ul>
      </div>
      <div class="bg-warm-100/50 border border-ink-900/10 p-5 rounded-sm border-l-4 border-l-tech-700">
        <h4 class="text-sm font-bold font-mono text-tech-700 mb-3 tracking-tight">가장 MONO다운 BM</h4>
        <ul class="text-[13px] font-bold text-ink-900 space-y-1">
          <li>1. 기술자 경력 자산 플랫폼</li>
          <li>2. 기술자 금융 플랫폼</li>
          <li>3. 은퇴 기술자 멘토링 플랫폼</li>
          <li>4. Tech-Blue</li>
          <li>5. 협업 로봇</li>
        </ul>
      </div>
    </div>

    <!-- BM Message Box -->
    <div class="mt-16 bg-ink-900 text-warm-50 p-8 md:p-12 text-center lcorner relative overflow-hidden reveal">
      <div class="absolute inset-0 blueprint opacity-20 pointer-events-none"></div>
      <p class="text-lg md:text-xl font-black mb-4 relative z-10 leading-relaxed" style="word-break: keep-all;">
        "MONO는 단순한 구인구직 플랫폼이 아닙니다."
      </p>
      <p class="text-base md:text-xl text-warm-200 font-medium relative z-10 leading-relaxed max-w-4xl mx-auto" style="word-break: keep-all;">
        기술자의 근무 경험을 <span class="text-tech-400 font-bold">신뢰 데이터로 축적</span>하고, 이를 <span class="text-warm-50 font-bold">일자리·금융·교육·복지·미래 자산</span>으로 연결하는 기술자 생애주기 플랫폼입니다.
      </p>
    </div>

  </div>
</section>
"""

idx1 = content.find('<!-- ============================== S5 · BM ============================== -->')
idx2 = content.find('<!-- ============================== S2 · LIFE CYCLE ============================== -->')

if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_bm + "\n" + content[idx2:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("BM replacements successful")
else:
    print("Could not find boundaries")
