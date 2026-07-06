import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the old flowchart wrapper if it exists so we don't duplicate
if '<div class="flowchart-wrapper' in html:
    html = re.sub(r'<div class="flowchart-wrapper.*?</style>\s*</head>', '</head>', html, flags=re.DOTALL)
    html = re.sub(r'<div class="flowchart-wrapper.*?</div>\s*</div>', '<!-- FLOWCHART_PLACEHOLDER -->', html, flags=re.DOTALL)
else:
    # If not injected yet, replace the image
    image_tag = '<img alt="MONO 데이터 인프라 흐름도" class="w-full h-auto mix-blend-multiply block" src="/images/mono_data_flowchart.png"/>'
    html = html.replace(image_tag, '<!-- FLOWCHART_PLACEHOLDER -->')

styles = """
<style>
  /* Flowchart Colors & Layout v2 */
  .flowchart-wrapper {
    container-type: inline-size;
    width: 100%;
    aspect-ratio: 1600/1050;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  }
  .board {
    position: absolute;
    top: 0;
    left: 0;
    width: 1600px;
    height: 1050px;
    transform: scale(calc(100cqw / 1600));
    transform-origin: top left;
  }

  .bg-mono-navy { background-color: #0c2b5e; }
  .text-mono-navy { color: #0c2b5e; }
  
  .bg-mono-blue { background-color: #1a5eb8; }
  .border-mono-blue { border-color: #1a5eb8; }
  
  .bg-mono-orange { background-color: #e68a2e; }
  .border-mono-orange { border-color: #e68a2e; }
  
  .bg-mono-green { background-color: #188a73; }
  .border-mono-green { border-color: #188a73; }
  
  .bg-mono-purple { background-color: #6a4cba; }
  .border-mono-purple { border-color: #6a4cba; }

  .panel-header {
    padding: 12px 16px;
    color: white;
    font-weight: 800;
    font-size: 18px;
    text-align: center;
  }
  
  .panel {
    position: absolute;
    background: white;
    border: 3px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    height: auto;
  }
  
  .panel-blue { border-color: #1a5eb8; }
  .panel-orange { border-color: #e68a2e; }
  .panel-green { border-color: #188a73; }
  .panel-purple { border-color: #6a4cba; }

  /* Adjusted Absolute Positioning */
  .pos-title { top: 35px; left: 0; width: 100%; text-align: center; }
  .pos-1 { left: 40px; top: 140px; width: 360px; min-height: 600px; }
  .pos-2 { left: 440px; top: 140px; width: 680px; }
  .pos-3 { left: 440px; top: 310px; width: 680px; }
  .pos-4 { left: 440px; top: 680px; width: 680px; }
  .pos-5 { left: 1160px; top: 140px; width: 400px; min-height: 600px; }
  .pos-6 { left: 40px; top: 850px; width: 1080px; }
  .pos-7 { left: 1160px; top: 850px; width: 400px; border-color: #1a5eb8; }
  .pos-footer { left: 0; bottom: 0; width: 100%; height: 70px; }

  svg.arrows {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  .icon-box {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    background: #f0f7ff;
    border: 2px solid #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #1a5eb8;
    flex-shrink: 0;
  }
  
  .core-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    margin: 0 auto 12px;
  }
</style>
"""

flowchart_html = """
<div class="flowchart-wrapper mt-10">
<div class="board">
  
  <!-- Title -->
  <div class="absolute pos-title z-20">
    <h1 class="text-[52px] font-black text-mono-navy tracking-tight mb-2">MONO 데이터 인프라 흐름도</h1>
    <p class="text-[22px] font-bold text-gray-700">현장 데이터로 기술노동자의 가치와 기업의 성장을 연결합니다.</p>
  </div>

  <!-- Refined SVG Arrows -->
  <svg class="arrows" viewBox="0 0 1600 1050">
    <defs>
      <!-- Modern, elegant chevron marker -->
      <marker id="arrow-solid" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </marker>
      <marker id="arrow-dash" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </marker>
    </defs>
    
    <g stroke="#64748b" stroke-width="3" stroke-linecap="round">
      <!-- 1 to 2 -->
      <path d="M400 205 L430 205" marker-end="url(#arrow-solid)"/>
      <!-- 1 to 3 -->
      <path d="M400 460 L430 460" marker-end="url(#arrow-solid)"/>
      <!-- 1 to 4 -->
      <path d="M400 740 L430 740" marker-end="url(#arrow-solid)"/>
      
      <!-- 2 to 3 -->
      <path d="M780 275 L780 300" marker-end="url(#arrow-solid)"/>
      <!-- 3 to 4 -->
      <path d="M780 645 L780 670" marker-end="url(#arrow-solid)"/>
      
      <!-- 2 to 5 -->
      <path d="M1120 205 L1150 205" marker-end="url(#arrow-solid)"/>
      <!-- 4 to 5 -->
      <path d="M1120 740 L1150 740" marker-end="url(#arrow-solid)"/>
    </g>

    <!-- Dotted Loops -->
    <g stroke="#3b82f6" stroke-width="3" stroke-dasharray="8,6" stroke-linecap="round">
      <!-- 6 to 4 (up) -->
      <path d="M780 850 L780 820" marker-end="url(#arrow-dash)"/>
      <!-- 5 to 7 (down) -->
      <path d="M1360 765 L1360 840" marker-end="url(#arrow-dash)"/>
      <!-- 7 to 6 (left) -->
      <path d="M1160 915 L1130 915" marker-end="url(#arrow-dash)"/>
      <!-- 6 to 1 (up) -->
      <path d="M220 850 L220 765" marker-end="url(#arrow-dash)"/>
    </g>
  </svg>

  <!-- 1. DATA SOURCES -->
  <div class="panel panel-blue pos-1 z-20">
    <div class="panel-header bg-mono-blue">1. 데이터 소스 (DATA SOURCES)</div>
    <div class="p-5 flex-1 flex flex-col gap-5">
      
      <!-- Worker App -->
      <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div class="icon-box"><i class="fa-solid fa-mobile-screen-button"></i></div>
        <div>
          <h3 class="font-black text-[18px] text-gray-900 mb-1.5">기술노동자 모바일 앱</h3>
          <ul class="text-[14px] text-gray-600 font-bold space-y-1 list-disc pl-5">
            <li>출퇴근 로그 (GPS)</li>
            <li>작업/근무 이력</li>
            <li>성실도 데이터</li>
            <li>안전 준수 체크</li>
            <li>자격/교육 정보</li>
          </ul>
        </div>
      </div>
      
      <!-- Portal -->
      <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div class="icon-box"><i class="fa-solid fa-desktop"></i></div>
        <div>
          <h3 class="font-black text-[18px] text-gray-900 mb-1.5">기업/현장 포털 & 서버 로그</h3>
          <ul class="text-[14px] text-gray-600 font-bold space-y-1 list-disc pl-5">
            <li>프로젝트/현장 데이터</li>
            <li>출역 관리 데이터</li>
            <li>결제/정산 데이터</li>
            <li>안전 점검/사고 데이터</li>
          </ul>
        </div>
      </div>
      
      <!-- API -->
      <div class="flex items-center gap-4 pb-4">
        <div class="icon-box"><i class="fa-solid fa-satellite-dish"></i></div>
        <div>
          <h3 class="font-black text-[18px] text-gray-900 mb-1.5">외부 API & 현장 IoT</h3>
          <ul class="text-[14px] text-gray-600 font-bold space-y-1 list-disc pl-5">
            <li>기상/교통 정보</li>
            <li>장비 가동 데이터</li>
            <li>재해/사고 정보</li>
            <li>정부/공공 데이터</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-auto bg-blue-50 text-mono-blue font-black text-center py-3 rounded-xl border border-blue-100 text-[16px]">
        실시간 & 배치 데이터 수집
      </div>
    </div>
  </div>

  <!-- 2. DATA INGESTION -->
  <div class="panel panel-blue pos-2 z-20">
    <div class="panel-header bg-mono-blue">2. 데이터 수집 (DATA INGESTION)</div>
    <div class="p-4 flex gap-4 h-full">
      <div class="flex-1 border-2 border-blue-100 bg-gradient-to-b from-white to-blue-50 rounded-xl flex items-center px-6 gap-6 shadow-sm">
        <div class="text-4xl text-mono-blue"><i class="fa-solid fa-wifi"></i></div>
        <div>
          <div class="font-black text-[18px] text-gray-900">실시간 데이터 수집</div>
          <div class="text-[14px] text-gray-500 font-bold mt-0.5">(스트리밍)</div>
        </div>
      </div>
      <div class="flex-1 border-2 border-blue-100 bg-gradient-to-b from-white to-blue-50 rounded-xl flex items-center px-6 gap-6 shadow-sm">
        <div class="text-4xl text-mono-blue"><i class="fa-solid fa-database"></i></div>
        <div>
          <div class="font-black text-[18px] text-gray-900">대량 데이터 수집</div>
          <div class="text-[14px] text-gray-500 font-bold mt-0.5">(배치 처리)</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. MONO CORE -->
  <div class="panel panel-blue pos-3 z-20">
    <div class="panel-header bg-mono-blue">3. MONO CORE (데이터 저장 & 핵심 처리)</div>
    <div class="p-5 flex flex-col h-full gap-3">
      <div class="text-center font-black text-[22px] text-mono-navy mb-1">기술노동자 데이터 엔진</div>
      
      <div class="flex items-stretch justify-between gap-3 flex-1">
        <!-- 1 -->
        <div class="flex-1 border-2 border-gray-100 rounded-xl bg-gray-50 p-4 text-center flex flex-col shadow-sm">
          <div class="core-circle bg-green-500 shadow-md"><i class="fa-solid fa-user-check"></i></div>
          <div class="font-black text-[16px] text-mono-navy mb-2">① 근무 신뢰 데이터</div>
          <p class="text-[13px] text-gray-600 font-bold leading-relaxed break-keep">출근/작업/안전/숙련도 등 모든 현장 데이터 통합 저장</p>
        </div>
        
        <div class="flex items-center justify-center text-gray-300 text-3xl"><i class="fa-solid fa-chevron-right"></i></div>
        
        <!-- 2 -->
        <div class="flex-1 border-2 border-gray-100 rounded-xl bg-gray-50 p-4 text-center flex flex-col shadow-sm">
          <div class="core-circle bg-blue-500 shadow-md"><i class="fa-solid fa-microchip"></i></div>
          <div class="font-black text-[16px] text-mono-navy mb-2">② AI 인력 매칭 엔진</div>
          <p class="text-[13px] text-gray-600 font-bold leading-relaxed break-keep">기술/경력/지역/현장 조건을 분석하여 최적의 매칭 추천</p>
        </div>
        
        <div class="flex items-center justify-center text-gray-300 text-3xl"><i class="fa-solid fa-chevron-right"></i></div>
        
        <!-- 3 -->
        <div class="flex-1 border-2 border-gray-100 rounded-xl bg-gray-50 p-4 text-center flex flex-col shadow-sm">
          <div class="core-circle bg-purple-600 shadow-md"><i class="fa-solid fa-gauge-high"></i></div>
          <div class="font-black text-[16px] text-mono-navy mb-2">③ 금융 신뢰 점수 (CB)</div>
          <p class="text-[13px] text-gray-600 font-bold leading-relaxed break-keep">근무 성실도 기반 대안 신용 평가 모델과 혜택 제공</p>
        </div>
      </div>
      
      <div class="mt-2 bg-[#eef5ff] rounded-xl px-5 py-3 flex justify-between items-center text-[14px]">
        <span class="font-black text-[#14335e]"><i class="fa-solid fa-lock mr-2"></i>데이터 보안 & 거버넌스</span>
        <span class="font-bold text-gray-600">철저한 보안, 개인정보 보호, 데이터 품질 관리</span>
      </div>
    </div>
  </div>

  <!-- 4. DATA WAREHOUSE -->
  <div class="panel panel-green pos-4 z-20">
    <div class="panel-header bg-mono-green">4. 데이터 웨어하우스 & 분석 허브</div>
    <div class="p-4 flex gap-4 h-full">
      <div class="flex-1 flex items-center gap-4 bg-green-50/50 rounded-xl p-3">
        <div class="w-[72px] h-[72px] rounded-xl bg-[#eef8f5] text-mono-green flex items-center justify-center text-[34px] shrink-0"><i class="fa-solid fa-server"></i></div>
        <div>
          <div class="font-black text-[17px] text-teal-900 mb-1.5">통합 데이터 웨어하우스</div>
          <p class="text-[13px] text-gray-600 font-bold leading-snug">· 정제된 데이터 저장<br>· 비즈니스 인텔리전스<br>· 통계/분석/예측</p>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-4 bg-green-50/50 rounded-xl p-3">
        <div class="w-[72px] h-[72px] rounded-xl bg-[#eef8f5] text-mono-green flex items-center justify-center text-[34px] shrink-0"><i class="fa-solid fa-chart-line"></i></div>
        <div>
          <div class="font-black text-[17px] text-teal-900 mb-1.5">분석 & 인사이트</div>
          <p class="text-[13px] text-gray-600 font-bold leading-snug">· 현장/기술자 생산성 분석<br>· 안전 리스크 예측<br>· 수요 예측 및 트렌드 분석</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. BUSINESS VALUE -->
  <div class="panel panel-orange pos-5 z-20">
    <div class="panel-header bg-mono-orange">5. 데이터 활용 & 가치 창출 (BUSINESS VALUE)</div>
    <div class="p-5 flex flex-col gap-4 flex-1">
      
      <!-- B2C -->
      <div class="bg-[#fff7ec] border border-[#fde2bd] rounded-xl p-4 flex-1 flex flex-col shadow-sm">
        <h4 class="text-center text-[#d96912] font-black text-[17px] mb-3">기술노동자를 위한 가치 (B2C)</h4>
        <div class="flex gap-2 flex-1">
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-orange-400"><i class="fa-solid fa-coins"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">대안 금융</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· CB 스코어 기반<br>· 대출/보험 연결<br>· 금융 포용 실현</p>
          </div>
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-blue-500"><i class="fa-solid fa-shield-heart"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">복지 & 성장</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· 실손/상해 보장<br>· 맞춤 교육 추천<br>· 커리어 성장 지원</p>
          </div>
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-yellow-500"><i class="fa-solid fa-handshake-angle"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">공정한 기회</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· 투명한 평가 관리<br>· 더 많은 현장 기회<br>· 소득 증대</p>
          </div>
        </div>
      </div>
      
      <!-- B2B -->
      <div class="bg-[#edf7ff] border border-[#cde8fb] rounded-xl p-4 flex-1 flex flex-col shadow-sm">
        <h4 class="text-center text-[#0f4f9a] font-black text-[17px] mb-3">기업을 위한 가치 (B2B SaaS / 산업 인프라)</h4>
        <div class="flex gap-2 flex-1">
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-blue-600"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">안전 & 컴플라이언스</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· 중대재해 예방<br>· 법적 의무 관리<br>· 리스크 모니터링</p>
          </div>
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-blue-600"><i class="fa-solid fa-arrow-trend-up"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">생산성 & 효율성</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· 숙련 인력 확보<br>· 현장 운영 최적화<br>· 비용 절감</p>
          </div>
          <div class="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col justify-center">
            <div class="text-[34px] mb-2 text-blue-600"><i class="fa-solid fa-handshake"></i></div>
            <div class="font-black text-mono-navy text-[14px] mb-2">상생 생태계</div>
            <p class="text-[11px] text-gray-600 font-bold leading-snug">· 협력사 상생 구조<br>· 건전한 인력 생태계<br>· 미래 인재 육성</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <!-- 6. FUTURE VISION -->
  <div class="panel panel-purple pos-6 z-20">
    <div class="panel-header bg-mono-purple">6. NEXT MONO = TECH-BLUE (미래 비전)</div>
    <div class="p-4 flex justify-between h-full items-center">
      <div class="flex-1 flex items-center gap-4 px-6 border-r border-gray-200">
        <div class="text-[48px] text-gray-700 shrink-0"><i class="fa-solid fa-robot"></i></div>
        <div>
          <div class="font-black text-[16px] text-indigo-900 mb-1">현장 협업 로보틱스 (Tech-Blue)</div>
          <p class="text-[12px] text-gray-600 font-bold leading-snug break-keep">· 위험/반복 작업 지원<br>· 모듈형 장비 & 작업 툴<br>· AI 소프트웨어 업데이트</p>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-4 px-6 border-r border-gray-200">
        <div class="text-[48px] text-blue-600 shrink-0"><i class="fa-solid fa-truck-fast"></i></div>
        <div>
          <div class="font-black text-[16px] text-indigo-900 mb-1">데이터 기반 로봇 R&D</div>
          <p class="text-[12px] text-gray-600 font-bold leading-snug break-keep">· 고위험 작업 대체<br>· 정밀 용접/미장 매칭<br>· 자율 이동/물류 지원</p>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-4 px-6">
        <div class="text-[48px] text-purple-600 shrink-0"><i class="fa-solid fa-brain"></i></div>
        <div>
          <div class="font-black text-[16px] text-indigo-900 mb-1">지속적인 데이터 선순환</div>
          <p class="text-[12px] text-gray-600 font-bold leading-snug break-keep">· 로봇/장비 데이터 수집<br>· 현장 데이터와 결합<br>· 더 나은 서비스로 진화</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 7. LOOP -->
  <div class="panel pos-7 z-20 border-mono-blue bg-white">
    <div class="p-5 flex items-center gap-5 h-full justify-center">
      <div class="text-[52px] text-mono-green"><i class="fa-solid fa-arrows-spin"></i></div>
      <div>
        <div class="font-black text-[19px] text-mono-navy mb-1.5">선순환 구조</div>
        <p class="text-[13px] text-gray-700 font-bold leading-snug">더 많은 데이터 → 더 정확한 매칭/분석<br>더 큰 가치 창출 → 더 많은 참여<br>지속 가능한 생태계 완성</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="absolute pos-footer z-30 bg-mono-navy flex items-center justify-between px-12 text-white shadow-lg">
    <div class="text-[16px] font-bold leading-snug">
      MONO는 데이터를 통해 기술노동자의 가치를 높이고, 기업의 경쟁력을 강화하며,<br>상생·건전한 산업 생태계를 만들어 대한민국 산업의 미래를 함께 설계합니다.
    </div>
    <div class="flex h-full py-4 gap-8">
      <div class="flex items-center gap-2.5 font-black text-[18px] pl-8 border-l border-white/20">
        <i class="fa-solid fa-shield-halved text-2xl"></i> 신뢰
      </div>
      <div class="flex items-center gap-2.5 font-black text-[18px] pl-8 border-l border-white/20">
        <i class="fa-solid fa-users text-2xl"></i> 상생
      </div>
      <div class="flex items-center gap-2.5 font-black text-[18px] pl-8 border-l border-white/20">
        <i class="fa-solid fa-arrow-trend-up text-2xl"></i> 성장
      </div>
      <div class="flex items-center gap-2.5 font-black text-[18px] pl-8 border-l border-white/20">
        <i class="fa-solid fa-robot text-2xl"></i> 혁신
      </div>
    </div>
  </div>

</div>
</div>
"""

html = html.replace('<!-- FLOWCHART_PLACEHOLDER -->', flowchart_html)
html = html.replace('</head>', styles + '\n</head>')

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated flowchart styles and injected successfully.")
