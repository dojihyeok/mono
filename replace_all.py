import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_gtm_bm = """<!-- ============================== S4 · STRATEGY ============================== -->
<section id="gtm" class="relative py-24 lg:py-32 grain-bg">
  <div class="absolute inset-0 blueprint opacity-30 pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-4"><span class="num">03</span> MONO 단계별 성장 전략</div>
      <h2 class="h-display text-ink-900">상생하며 성장하는 7단계 스케일업 로드맵</h2>
      <p class="body-lg mt-5" style="font-size: 1.2rem; line-height: 1.75;">기술자와 기업이 함께 상생하며 7단계로 이어지는 순차적 성장 흐름. 기술자의 확보부터 글로벌 확장까지 탄탄한 생활 인프라 위에서 실행됩니다.</p>
    </div>

    <!-- Timeline Stepper UI for 7 steps -->
    <div class="relative max-w-4xl mx-auto z-10 reveal">
      
      <!-- Vertical Line -->
      <div class="absolute left-[32px] md:left-[40px] top-[40px] bottom-[40px] w-[2px] bg-gradient-to-b from-tech-700/50 via-tech-500/30 to-warm-50/0 z-0 hidden md:block"></div>
      
      <div class="flex flex-col gap-8 md:gap-12 relative z-10">
        
        <!-- Step 1 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              01
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">첫걸음</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 확보</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>가입 절차 혁신:</strong> 회원가입 시 제출 서류 최소화, 간편인증 연동, 건강보험 자격 정보 및 주민등록등본 자동 제출 지원 (외국인 체류 자격 정보 연동 검토)</li>
              <li><strong>경력 자동 인증:</strong> 자격증 자동 등록, 관련 협회 경력 연동, 교육 이수 내역 연동, 현장 경력 포트폴리오 구축</li>
            </ul>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              02
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">연결</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">일자리 연결</h3>
            <p class="body-md text-ink-700 leading-relaxed">지역 기반 일자리 추천, 기술 분야별 맞춤 추천, 급여 조건 비교, 장기 근무 현장 추천, 현장 평가 기반 추천 제공.</p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              03
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-safety-tape text-ink-900 border border-safety-amber/50 font-bold">현장 지원</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">현장 생활 지원</h3>
            <p class="body-md text-ink-800 font-bold mb-3">목적: 기술자의 하루를 지원하는 생활 인프라 구축</p>
            <ul class="body-md text-ink-700 leading-relaxed space-y-2">
              <li><i class="fa-solid fa-utensils text-tech-600 w-5"></i> 현장 주변 식당 정보 및 도시락 식사 서비스</li>
              <li><i class="fa-solid fa-bed text-tech-600 w-5"></i> 숙박 시설 정보 및 쾌적한 휴식 공간 정보</li>
              <li><i class="fa-solid fa-shower text-tech-600 w-5"></i> 샤워 및 운동 시설 정보</li>
              <li><i class="fa-solid fa-hospital text-tech-600 w-5"></i> 병원 및 의료시설 정보</li>
            </ul>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              04
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">성장</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 성장 지원</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>기술 이력 관리:</strong> 근무 이력, 자격증, 교육 이력, 안전 교육 이력 자산화</li>
              <li><strong>금융 연결:</strong> 근무 기록 기반 신뢰 데이터로 대출 등 금융 서비스 연계 및 보험 연계</li>
              <li><strong>교육 지원:</strong> 안전 교육, 기술 교육, 자격증 교육, 해외 취업 교육 지원</li>
            </ul>
          </div>
        </div>

        <!-- Step 5 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              05
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">동행</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">파트너사 확보</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>채용 지원:</strong> 공고 등록 간소화, 반복 채용 템플릿, 우수 인재 추천 기능</li>
              <li><strong>행정 지원:</strong> 출역 관리, 근태 관리, 계약 관리, 정산 지원, 4대 보험 관리 대행</li>
            </ul>
          </div>
        </div>

        <!-- Step 6 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
              06
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">상생</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">현장 반장 및 인력사무소 상생</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3 mb-4">
              <li><strong>현장 반장:</strong> 디지털 출역 관리, 인력 배치 관리, 기술자 평가 관리, 우수 인력 추천 기능</li>
              <li><strong>인력사무소:</strong> 디지털 인력사무소 운영 인프라, 인력 데이터베이스 제공, 정산 자동화, 채용 관리 지원</li>
            </ul>
            <div class="p-4 bg-tech-50 border border-tech-700/20 rounded-sm">
              <p class="text-sm font-bold text-tech-800">MONO는 현장 반장과 인력사무소를 대체하지 않습니다. 현장의 경험과 신뢰를 디지털 기술과 연결하여 더 많은 기회를 만드는 상생 플랫폼입니다.</p>
            </div>
          </div>
        </div>

        <!-- Step 7 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-500 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-500 group-hover/step:text-warm-50 transition-colors duration-500">
              07
            </div>
          </div>
          <div class="hyper-glow-box bg-tech-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-tech-500/30 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-tech-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-500 text-warm-50 font-bold border border-tech-500">도약</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">글로벌 확장</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold">해외 일자리 연결, 비자 지원 정보 제공, 해외 정착 지원, 글로벌 경력 관리 연동.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<div class="tape-divider"></div>

<!-- ============================== S5 · BM ============================== -->
<section id="bm" class="relative py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-4"><span class="num">04</span> MONO 비즈니스 모델 · Business Model</div>
      <h2 class="h-display text-ink-900 mb-4">현재를 혁신하고 미래를 연결하는 수익 구조</h2>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-12 reveal stagger">
      <!-- 1. 현재 BM -->
      <div class="bg-warm-100 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="text-tech-700 font-mono font-bold tracking-widest text-xs mb-2">PRESENT MODEL</div>
        <h3 class="text-2xl font-black text-ink-900 mb-6 pb-4 border-b border-ink-900/10">현재 BM</h3>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1">안심 정산 서비스</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 정산 대행 수수료</span></div>
            <p class="text-sm text-ink-700">임금 체불 방지 및 투명한 정산 가치 제공</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1">기업용 현장관리 서비스</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 월 구독료</span></div>
            <p class="text-sm text-ink-700">출역 관리, 노무 관리, 행정 자동화 가치 제공</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1">채용 및 인재 매칭</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 채용 수수료, 정규직 전환 수수료</span></div>
            <p class="text-sm text-ink-700">검증된 기술자 확보 가치 제공</p>
          </div>
        </div>
      </div>

      <!-- 2. 성장 BM -->
      <div class="bg-warm-100 border border-ink-900/15 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-600">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-600/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="text-tech-700 font-mono font-bold tracking-widest text-xs mb-2">GROWTH MODEL</div>
        <h3 class="text-2xl font-black text-ink-900 mb-6 pb-4 border-b border-ink-900/10">성장 BM</h3>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-ink-900 mb-1">기술 교육 플랫폼</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 교육 수강료, 기업 교육 위탁</span></div>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1">작업복 및 안전용품</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 상품 판매 수익, 자체 브랜드(PB)</span></div>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1">장비 및 인력 플랫폼</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 대여 수수료, 채용 수수료(외국인)</span></div>
            <p class="text-sm text-ink-700">장비 공유/대여, 외국인 정착 지원 서비스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-1">기술자 복지 서비스</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-100 text-tech-800 px-2 py-0.5 rounded">수익: 멤버십, 제휴 수수료</span></div>
            <p class="text-sm text-ink-700">숙박, 식당, 의료, 운동 시설</p>
          </div>
        </div>
      </div>

      <!-- 3. 미래 BM -->
      <div class="glass-dark border border-tech-400/30 lcorner p-8 hover-lift shadow-sm flex flex-col relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-32 h-32 bg-tech-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="text-tech-400 font-mono font-bold tracking-widest text-xs mb-2">FUTURE MODEL</div>
        <h3 class="text-2xl font-black text-warm-50 mb-6 pb-4 border-b border-tech-800/50">미래 BM</h3>
        <div class="space-y-6 flex-grow">
          <div>
            <h4 class="font-bold text-warm-100 mb-1">금융 신뢰 데이터</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-900 text-tech-300 px-2 py-0.5 rounded border border-tech-700/50">수익: 금융기관 제휴, 보험사 제휴</span></div>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1">AI 현장 비서 & Tech-Blue</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-900 text-tech-300 px-2 py-0.5 rounded border border-tech-700/50">수익: 월 구독, 운영/데이터 서비스</span></div>
            <p class="text-sm text-warm-200">공법 안내, 안전 가이드, 작업 지원</p>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1">구독형 협업 로봇(RaaS)</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-900 text-tech-300 px-2 py-0.5 rounded border border-tech-700/50">수익: 로봇 임대, 운영 소프트웨어</span></div>
          </div>
          <div>
            <h4 class="font-bold text-warm-100 mb-1">장비 공동 소유 플랫폼</h4>
            <div class="flex flex-wrap gap-2 mb-1.5"><span class="text-xs bg-tech-900 text-tech-300 px-2 py-0.5 rounded border border-tech-700/50">수익: 자산 운영 수수료</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 보조 BM: 생활 인프라 BM -->
    <div class="reveal max-w-4xl mx-auto mt-12 bg-warm-50/50 border border-ink-900/10 p-6 md:p-8 lcorner shadow-sm border-l-4 border-l-tech-700">
      <div class="flex items-center gap-3 mb-6">
        <i class="fa-solid fa-city text-tech-700 text-xl"></i>
        <h3 class="text-xl font-bold text-ink-900">기술자 생활 인프라 연계 BM</h3>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h4 class="font-bold text-ink-900 text-sm mb-1">식사 & 숙박 서비스</h4>
          <p class="text-xs text-ink-600 leading-relaxed">식당 제휴, 도시락 중개, 숙박 예약, 장기 숙소 연결</p>
        </div>
        <div>
          <h4 class="font-bold text-ink-900 text-sm mb-1">모듈형 숙소</h4>
          <p class="text-xs text-ink-600 leading-relaxed">기업 대상 임대, 현장 숙소 운영</p>
        </div>
        <div>
          <h4 class="font-bold text-ink-900 text-sm mb-1">의료 및 휴식 서비스</h4>
          <p class="text-xs text-ink-600 leading-relaxed">병원 제휴, 건강검진, 물리치료</p>
        </div>
        <div>
          <h4 class="font-bold text-ink-900 text-sm mb-1">기술자 쇼핑몰</h4>
          <p class="text-xs text-ink-600 leading-relaxed">작업복, 공구, 안전장비</p>
        </div>
        <div class="col-span-2 md:col-span-1">
          <h4 class="font-bold text-ink-900 text-sm mb-1">중장비 거래 플랫폼</h4>
          <p class="text-xs text-ink-600 leading-relaxed">판매, 대여, 공유</p>
        </div>
      </div>
    </div>

    <!-- BM Message Box -->
    <div class="mt-16 bg-ink-900 text-warm-50 p-8 md:p-12 text-center lcorner relative overflow-hidden reveal">
      <div class="absolute inset-0 blueprint opacity-20 pointer-events-none"></div>
      <p class="text-lg md:text-xl font-black mb-4 relative z-10 leading-relaxed" style="word-break: keep-all;">
        "MONO는 단순한 구인구직 플랫폼이 아닙니다.<br class="hidden md:block">
        기술자의 일, 생활, 성장, 금융을 연결하여 <span class="text-tech-400">기술자의 경험이 자산이 되는 생태계</span>를 구축합니다."
      </p>
      <p class="text-base md:text-lg text-warm-200 font-medium relative z-10" style="word-break: keep-all;">
        기업은 더 좋은 인재를 확보하고, 기술자는 더 많은 기회를 얻으며, 산업은 더욱 안전하고 효율적으로 성장할 수 있습니다.
      </p>
    </div>

  </div>
</section>

"""

idx1 = content.find('<!-- ============================== S4 · STRATEGY ============================== -->')
idx2 = content.find('<!-- ============================== S2 · LIFE CYCLE ============================== -->')

if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_gtm_bm + "\n" + content[idx2:]
    
    # Also clean up the chart.js scripts at the bottom that will throw errors now that the canvases are gone
    chart_start = content.find('// ---------- Charts ----------')
    chart_end = content.find('</script>', chart_start)
    if chart_start != -1 and chart_end != -1:
        content = content[:chart_start] + content[chart_end:]

    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("GTM & BM Replacements Successful")
else:
    print("Could not find boundaries")
