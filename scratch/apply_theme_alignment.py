import io

def main():
    file_path = "/Users/yunhyeok/mono/web/public/strategy.html"
    
    with io.open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Section 02 header replacement
    old_sec2_header = """        <div class="section-label"><span class="num">02</span> MONO VISION & 상생 인프라</div>
        <h2 class="h-section text-ink-900 font-extrabold">대한민국 산업의 구조적 과제, 그리고 MONO가 만들어가는 변화</h2>"""
    
    new_sec2_header = """        <div class="section-label mb-6"><span class="num">02</span> MONO VISION & 상생 인프라</div>
        <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">대한민국 산업의 구조적 과제, 그리고 MONO가 만들어가는 변화</h2>"""

    content = content.replace(old_sec2_header, new_sec2_header)

    # 2. Section 03 header replacement
    old_sec3_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">03</span> TOURNAMENT STRATEGY</div>
      <h2 class="h-section text-ink-900 font-extrabold">모두의 창업 1라운드부터 우승까지, 단계별 통과 전략</h2>
      
      <!-- 보강 문구 -->
      <p class="body-md mt-4 text-justify break-keep max-w-3xl mx-auto">
        MONO의 라운드 전략은 앱 사용자를 먼저 대량 유입시키는 방식보다, 기업 협약과 채용 공고 등록을 먼저 확보해 기술자가 들어올 이유를 만드는 B2B 선행 전략을 우선합니다.
        기업 공고, 현장 운영 수요, 장비 요청 데이터를 먼저 확보하고, 그 수요를 기반으로 기술자 프로필 작성과 재방문을 유도합니다.
      </p>
    </div>"""
    
    # Try alternate spacing/formatting if the above doesn't match
    alternate_sec3_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">03</span> TOURNAMENT STRATEGY</div>
      <h2 class="h-section text-ink-900 font-extrabold">모두의 창업 1라운드부터 우승까지, 단계별 통과 전략</h2>
      
      <!-- 보강 문구 -->
      <p class="body-md mt-4 text-justify break-keep max-w-3xl mx-auto">
        MONO의 라운드 전략은 앱 사용자를 먼저 대량 유입시키는 방식보다, 기업 협약과 채용 공고 등록을 먼저 확보해 기술자가 들어올 이유를 만드는 B2B 선행 전략을 우선합니다. 기업 공고, 현장 운영 수요, 장비 요청 데이터를 먼저 확보하고, 그 수요를 기반으로 기술자 프로필 작성과 재방문을 유도합니다.
      </p>
    </div>"""

    new_sec3_header = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">03</span> 모두의 창업 오디션 전략</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">모두의 창업 1라운드부터 우승까지, 단계별 통과 전략</h2>
      
      <!-- 보강 문구 -->
      <p class="body-md mt-6 text-justify break-keep">
        MONO의 라운드 전략은 앱 사용자를 먼저 대량 유입시키는 방식보다, 기업 협약과 채용 공고 등록을 먼저 확보해 기술자가 들어올 이유를 만드는 B2B 선행 전략을 우선합니다. 기업 공고, 현장 운영 수요, 장비 요청 데이터를 먼저 확보하고, 그 수요를 기반으로 기술자 프로필 작성과 재방문을 유도합니다.
      </p>
    </div>"""

    if old_sec3_header in content:
        content = content.replace(old_sec3_header, new_sec3_header)
    elif alternate_sec3_header in content:
        content = content.replace(alternate_sec3_header, new_sec3_header)

    # 3. Section 04 header replacement
    old_sec4_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">04</span> GROWTH ROADMAP</div>
      <h2 class="h-section text-ink-900 font-extrabold">산업 신뢰 인프라로 진화하는 5단계 성장 로드맵</h2>
      <p class="body-md mt-2">
        단계별 타겟 검증 마일스톤을 실증하고 수집된 현장 데이터를 활용하여 Next MONO의 비전으로 스케일업합니다.
      </p>
    </div>"""

    new_sec4_header = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">04</span> MONO 단계별 성장 전략</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">산업 신뢰 인프라로 진화하는 5단계 성장 로드맵</h2>
      <p class="body-md mt-6 text-justify break-keep">
        단계별 타겟 검증 마일스톤을 실증하고 수집된 현장 데이터를 활용하여 Next MONO의 비전으로 스케일업합니다.
      </p>
    </div>"""

    content = content.replace(old_sec4_header, new_sec4_header)

    # 4. Section 05 header replacement
    old_sec5_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">05</span> REVENUE STACK</div>
      <h2 class="h-section text-ink-900 font-extrabold">기술자의 경험이 신뢰 데이터가 되는 비즈니스 모델</h2>
      <p class="body-md mt-2">
        MONO의 수익 구조는 단순 일회성 중개를 넘어 다각화된 4대 핵심 매출 인프라를 바탕으로 고도화됩니다.
      </p>
    </div>"""

    new_sec5_header = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">05</span> MONO 비즈니스 모델</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">기술자의 경험이 신뢰 데이터가 되는 비즈니스 모델</h2>
      <p class="body-md mt-6 text-justify break-keep">
        MONO의 수익 구조는 단순 일회성 중개를 넘어 다각화된 4대 핵심 매출 인프라를 바탕으로 고도화됩니다.
      </p>
    </div>"""

    content = content.replace(old_sec5_header, new_sec5_header)

    # 5. Section 06 header replacement
    old_sec6_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">06</span> BRAND PHILOSOPHY</div>
      <h2 class="h-section text-ink-900 font-extrabold">Masters of Noble Trades: 고귀한 기술 거래와 장인 정신</h2>
      
      <!-- 수정 및 추가 문구 -->
      <div class="space-y-4 text-justify break-keep text-ink-800 text-sm leading-relaxed max-w-3xl mx-auto mt-6">
        <p class="font-bold text-base text-ink-900">
          "MONO의 철학은 기술자의 경험을 낮은 단가의 노동력이 아니라, 산업의 신뢰 자산으로 보는 데서 시작합니다."
        </p>
        <p>
          Masters of Noble Trades는 MONO가 기술자를 바라보는 기준입니다.
          기술자의 경력, 현장 경험, 안전교육, 장비 사용 이력은 개인의 기록을 넘어 기업과 산업이 신뢰할 수 있는 데이터가 됩니다.
          MONO는 땀 흘려 가치를 일궈내는 전국의 모든 현장 기술 근로자들을 장인으로 우대합니다.
        </p>
      </div>
    </div>"""

    alternate_sec6_header = """    <div class="max-w-4xl mx-auto text-center mb-12">
      <div class="section-label mb-3"><span class="num">06</span> BRAND PHILOSOPHY</div>
      <h2 class="h-section text-ink-900 font-extrabold">Masters of Noble Trades: 고귀한 기술 거래와 장인 정신</h2>
      
      <!-- 수정 및 추가 문구 -->
      <div class="space-y-4 text-justify break-keep text-ink-800 text-sm leading-relaxed max-w-3xl mx-auto mt-6">
        <p class="font-bold text-base text-ink-900">
          "MONO의 철학은 기술자의 경험을 낮은 단가의 노동력이 아니라, 산업의 신뢰 자산으로 보는 데서 시작합니다."
        </p>
        <p>
          Masters of Noble Trades는 MONO가 기술자를 바라보는 기준입니다. 기술자의 경력, 현장 경험, 안전교육, 장비 사용 이력은 개인의 기록을 넘어 기업과 산업이 신뢰할 수 있는 데이터가 됩니다. MONO는 땀 흘려 가치를 일궈내는 전국의 모든 현장 기술 근로자들을 장인으로 우대합니다.
        </p>
      </div>
    </div>"""

    new_sec6_header = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">06</span> MONO 브랜드 철학</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">Masters of Noble Trades: 고귀한 기술 거래와 장인 정신</h2>
      
      <!-- 수정 및 추가 문구 -->
      <div class="space-y-4 text-justify break-keep text-ink-800 text-sm leading-relaxed mt-6">
        <p class="font-bold text-base text-ink-900">
          "MONO의 철학은 기술자의 경험을 낮은 단가의 노동력이 아니라, 산업의 신뢰 자산으로 보는 데서 시작합니다."
        </p>
        <p>
          Masters of Noble Trades는 MONO가 기술자를 바라보는 기준입니다. 기술자의 경력, 현장 경험, 안전교육, 장비 사용 이력은 개인의 기록을 넘어 기업과 산업이 신뢰할 수 있는 데이터가 됩니다. MONO는 땀 흘려 가치를 일궈내는 전국의 모든 현장 기술 근로자들을 장인으로 우대합니다.
        </p>
      </div>
    </div>"""

    if old_sec6_header in content:
        content = content.replace(old_sec6_header, new_sec6_header)
    elif alternate_sec6_header in content:
        content = content.replace(alternate_sec6_header, new_sec6_header)

    # 6. Section 07 (Next MONO) completely replaced with light theme & left-aligned heading
    old_sec7_section = """<section id="vision" class="relative py-24 bg-ink-900 text-warm-50 overflow-hidden">
  <div class="absolute inset-0 blueprint-dark opacity-30 pointer-events-none mix-blend-overlay"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 opacity-90 pointer-events-none"></div>
  
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mx-auto mb-16 reveal text-center">
      <div class="section-label section-label--dark mb-4"><span class="num">07</span> Next MONO · Industrial Intelligence Platform</div>
      
      <h2 class="h-display text-white leading-tight tracking-tight mb-6">Industrial Intelligence Platform</h2>
      
      <!-- 추가 문구 -->
      <p class="body-lg text-warm-200 text-justify break-keep max-w-4xl mx-auto leading-relaxed mb-6" style="font-size: 1.25rem;">
        Next MONO는 산업 현장의 신뢰 데이터를 기반으로 작동하는 Industrial Intelligence Platform입니다.
      </p>
      <p class="body-md text-warm-300 text-justify break-keep max-w-3xl mx-auto leading-relaxed mb-10">
        MONO가 축적하는 기술자 프로필, 기업 공고, 현장 배치, 안전교육, 장비 사용, 소모자재 발주, 정산 데이터는 장기적으로 산업 현장 의사결정을 지원하는 AI 운영체제의 기반이 됩니다. AGI Core OS는 현장의 사람을 대체하는 개념이 아니라, 기술자와 기업이 더 안전하고 효율적으로 일할 수 있도록 돕는 산업 의사결정 엔진입니다.
      </p>
    </div>

    <!-- Grid showing Next MONO core products and their image mockups (existing images preserved) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Item 1. Tech-Blue -->
      <article class="bg-ink-800/60 border border-warm-200/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-ink-950 relative">
            <img src="images/tech_blue_worker.png" alt="Tech-Blue 인재" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">PEOPLE</div>
          </div>
          <h4 class="text-lg font-black text-white mb-2">Tech-Blue · 미래 산업 기술자</h4>
          <p class="text-xs text-warm-300 leading-relaxed mb-4 text-justify break-keep">
            현장 경험, 안전 이력, 장비 운용 능력, AI 활용 역량을 함께 갖춘 새로운 블루칼라 기술 장인입니다.
          </p>
        </div>
        <button onclick="document.getElementById('tech-blue-modal').showModal()" class="w-full py-2.5 bg-ink-900 hover:bg-indigo-600 text-warm-100 border border-warm-200/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          Tech-Blue 자세히 보기
        </button>
      </article>

      <!-- Item 2. AGI Core OS -->
      <article class="bg-ink-800/60 border border-warm-200/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-ink-950 relative">
            <img src="images/agi_core_os_structure.jpg" alt="AGI Core OS 구조도" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">INTELLIGENCE</div>
          </div>
          <h4 class="text-lg font-black text-white mb-2">AGI Core OS · 현장 AI 의사결정</h4>
          <p class="text-xs text-warm-300 leading-relaxed mb-4 text-justify break-keep">
            기술자 데이터, 장비 데이터, 안전 데이터, 기업 요청 데이터를 기반으로 최적화된 매칭과 예측을 제공하는 보조 지능입니다.
          </p>
        </div>
        <button onclick="document.getElementById('agi-core-os-modal').showModal()" class="w-full py-2.5 bg-ink-900 hover:bg-indigo-600 text-warm-100 border border-warm-200/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          AGI Core OS 구조 보기
        </button>
      </article>

      <!-- Item 3. MONO Device -->
      <article class="bg-ink-800/60 border border-warm-200/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-ink-950 relative">
            <img src="images/mono_device_field.png" alt="MONO Device 현장" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">CONNECTIVITY</div>
          </div>
          <h4 class="text-lg font-black text-white mb-2">MONO Device · 현장 IoT 디바이스</h4>
          <p class="text-xs text-warm-300 leading-relaxed mb-4 text-justify break-keep">
            작업자 웨어러블, 스마트 계측기, 안전 센서 및 장비 태그를 연동하여 가공되지 않은 현장 데이터를 실시간 수집합니다.
          </p>
        </div>
        <button onclick="document.getElementById('mono-device-modal').showModal()" class="w-full py-2.5 bg-ink-900 hover:bg-indigo-600 text-warm-100 border border-warm-200/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          MONO Device 확장 보기
        </button>
      </article>
    </div>

    <!-- 신규 이미지 추가: Next MONO 데이터 확장 루프 (도식 5) -->
    <div class="bg-ink-800/70 border border-cyan-500/20 p-4 rounded-xl shadow-2xl zoomable-svg-container max-w-3xl mx-auto" onclick="openLightbox(this)">
      <div class="text-center pb-2 border-b border-warm-200/10 mb-3 flex items-center justify-between">
        <span class="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest"><i class="fa-solid fa-arrows-spin text-cyan-400"></i> [도식 5] Next MONO 데이터 확장 루프</span>
        <span class="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-magnifying-glass-plus"></i> 확대보기</span>
      </div>
      <div class="w-full flex items-center justify-center bg-ink-950/60 p-2 rounded-lg">
        <svg viewBox="0 0 500 350" class="w-full h-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brain-glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#0E7490" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="250" cy="175" r="140" fill="url(#brain-glow2)" />
          
          <!-- Loop Cycle Flowcharts -->
          <!-- Left: 현장 데이터 축적 -->
          <rect x="20" y="130" width="150" height="90" rx="6" fill="#0F172A" stroke="#22D3EE" stroke-width="1.5"/>
          <text x="95" y="160" text-anchor="middle" font-size="10" font-weight="900" fill="#22D3EE">현장 데이터 축적</text>
          <text x="95" y="180" text-anchor="middle" font-size="8" fill="#94A3B8">· 프로필, 공고, 배치</text>
          <text x="95" y="195" text-anchor="middle" font-size="8" fill="#94A3B8">· 안전교육, 장비, 발주</text>

          <!-- Right: AI 의사결정 보조 (AGI Core OS) -->
          <rect x="330" y="130" width="150" height="90" rx="6" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
          <text x="405" y="160" text-anchor="middle" font-size="10" font-weight="900" fill="#10B981">AGI Core OS</text>
          <text x="405" y="180" text-anchor="middle" font-size="8" fill="#94A3B8">· 현장 의사결정 지원</text>
          <text x="405" y="195" text-anchor="middle" font-size="8" fill="#94A3B8">· 인재/장비 최적 추천</text>

          <!-- Connecting Loops -->
          <path d="M 170 150 C 250 110, 250 110, 330 150" fill="none" stroke="#22D3EE" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="250" y="115" text-anchor="middle" font-size="8" fill="#22D3EE">실시간 데이터 송출</text>

          <path d="M 330 200 C 250 240, 250 240, 170 200" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="250" y="240" text-anchor="middle" font-size="8" fill="#10B981">의사결정 피드백 적용</text>
        </svg>
      </div>
    </div>
  </div>
</section>"""

    new_sec7_section = """<section id="vision" class="relative py-24 bg-warm-50 text-ink-900 overflow-hidden">
  <div class="absolute inset-0 blueprint opacity-20 pointer-events-none mix-blend-overlay"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-warm-50 via-warm-100/50 to-warm-50 opacity-90 pointer-events-none"></div>
  
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">07</span> Next MONO · Industrial Intelligence Platform</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight mb-6">Industrial Intelligence Platform</h2>
      
      <!-- 추가 문구 -->
      <p class="body-lg text-ink-800 text-justify break-keep font-semibold mt-6" style="font-size: 1.25rem;">
        Next MONO는 산업 현장의 신뢰 데이터를 기반으로 작동하는 Industrial Intelligence Platform입니다.
      </p>
      <p class="body-md text-ink-700 text-justify break-keep mt-4">
        MONO가 축적하는 기술자 프로필, 기업 공고, 현장 배치, 안전교육, 장비 사용, 소모자재 발주, 정산 데이터는 장기적으로 산업 현장 의사결정을 지원하는 AI 운영체제의 기반이 됩니다. AGI Core OS는 현장의 사람을 대체하는 개념이 아니라, 기술자와 기업이 더 안전하고 효율적으로 일할 수 있도록 돕는 산업 의사결정 엔진입니다.
      </p>
    </div>

    <!-- Grid showing Next MONO core products and their image mockups (existing images preserved) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Item 1. Tech-Blue -->
      <article class="bg-white border border-ink-900/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-sm">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-warm-100 relative">
            <img src="images/tech_blue_worker.png" alt="Tech-Blue 인재" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">PEOPLE</div>
          </div>
          <h4 class="text-lg font-black text-ink-900 mb-2">Tech-Blue · 미래 산업 기술자</h4>
          <p class="text-xs text-ink-700 leading-relaxed mb-4 text-justify break-keep">
            현장 경험, 안전 이력, 장비 운용 능력, AI 활용 역량을 함께 갖춘 새로운 블루칼라 기술 장인입니다.
          </p>
        </div>
        <button onclick="document.getElementById('tech-blue-modal').showModal()" class="w-full py-2.5 bg-warm-50 hover:bg-indigo-600 text-ink-900 hover:text-white border border-ink-900/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          Tech-Blue 자세히 보기
        </button>
      </article>

      <!-- Item 2. AGI Core OS -->
      <article class="bg-white border border-ink-900/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-sm">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-warm-100 relative">
            <img src="images/agi_core_os_structure.jpg" alt="AGI Core OS 구조도" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">INTELLIGENCE</div>
          </div>
          <h4 class="text-lg font-black text-ink-900 mb-2">AGI Core OS · 현장 AI 의사결정</h4>
          <p class="text-xs text-ink-700 leading-relaxed mb-4 text-justify break-keep">
            기술자 데이터, 장비 데이터, 안전 데이터, 기업 요청 데이터를 기반으로 최적화된 매칭과 예측을 제공하는 보조 지능입니다.
          </p>
        </div>
        <button onclick="document.getElementById('agi-core-os-modal').showModal()" class="w-full py-2.5 bg-warm-50 hover:bg-indigo-600 text-ink-900 hover:text-white border border-ink-900/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          AGI Core OS 구조 보기
        </button>
      </article>

      <!-- Item 3. MONO Device -->
      <article class="bg-white border border-ink-900/10 p-6 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-sm">
        <div>
          <div class="aspect-video w-full mb-4 overflow-hidden rounded-lg bg-warm-100 relative">
            <img src="images/mono_device_field.png" alt="MONO Device 현장" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">CONNECTIVITY</div>
          </div>
          <h4 class="text-lg font-black text-ink-900 mb-2">MONO Device · 현장 IoT 디바이스</h4>
          <p class="text-xs text-ink-700 leading-relaxed mb-4 text-justify break-keep">
            작업자 웨어러블, 스마트 계측기, 안전 센서 및 장비 태그를 연동하여 가공되지 않은 현장 데이터를 실시간 수집합니다.
          </p>
        </div>
        <button onclick="document.getElementById('mono-device-modal').showModal()" class="w-full py-2.5 bg-warm-50 hover:bg-indigo-600 text-ink-900 hover:text-white border border-ink-900/10 hover:border-indigo-600 font-bold text-xs rounded transition-colors text-center">
          MONO Device 확장 보기
        </button>
      </article>
    </div>

    <!-- 신규 이미지 추가: Next MONO 데이터 확장 루프 (도식 5) -->
    <div class="bg-white border border-ink-900/10 p-4 rounded-xl shadow-neo-soft zoomable-svg-container max-w-3xl mx-auto" onclick="openLightbox(this)">
      <div class="text-center pb-2 border-b border-warm-200/10 mb-3 flex items-center justify-between">
        <span class="text-[11px] font-mono font-bold text-ink-500 uppercase tracking-widest"><i class="fa-solid fa-arrows-spin text-indigo-600"></i> [도식 5] Next MONO 데이터 확장 루프</span>
        <span class="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-magnifying-glass-plus"></i> 확대보기</span>
      </div>
      <div class="w-full flex items-center justify-center bg-warm-50/50 p-2 rounded-lg">
        <svg viewBox="0 0 500 350" class="w-full h-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brain-glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#818CF8" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#FCFCFE" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="250" cy="175" r="140" fill="url(#brain-glow2)" />
          
          <!-- Loop Cycle Flowcharts -->
          <!-- Left: 현장 데이터 축적 -->
          <rect x="20" y="130" width="150" height="90" rx="6" fill="#F8FAFC" stroke="#4F46E5" stroke-width="1.5"/>
          <text x="95" y="160" text-anchor="middle" font-size="10" font-weight="900" fill="#4F46E5">현장 데이터 축적</text>
          <text x="95" y="180" text-anchor="middle" font-size="8" fill="#475569">· 프로필, 공고, 배치</text>
          <text x="95" y="195" text-anchor="middle" font-size="8" fill="#475569">· 안전교육, 장비, 발주</text>

          <!-- Right: AI 의사결정 보조 (AGI Core OS) -->
          <rect x="330" y="130" width="150" height="90" rx="6" fill="#F8FAFC" stroke="#10B981" stroke-width="1.5"/>
          <text x="405" y="160" text-anchor="middle" font-size="10" font-weight="900" fill="#10B981">AGI Core OS</text>
          <text x="405" y="180" text-anchor="middle" font-size="8" fill="#475569">· 현장 의사결정 지원</text>
          <text x="405" y="195" text-anchor="middle" font-size="8" fill="#475569">· 인재/장비 최적 추천</text>

          <!-- Connecting Loops -->
          <path d="M 170 150 C 250 110, 250 110, 330 150" fill="none" stroke="#4F46E5" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="250" y="115" text-anchor="middle" font-size="8" fill="#4F46E5">실시간 데이터 송출</text>

          <path d="M 330 200 C 250 240, 250 240, 170 200" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="250" y="240" text-anchor="middle" font-size="8" fill="#10B981">의사결정 피드백 적용</text>
        </svg>
      </div>
    </div>
  </div>
</section>"""

    content = content.replace(old_sec7_section, new_sec7_section)

    with io.open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Alignment and theme replacements completed on strategy.html successfully.")

if __name__ == "__main__":
    main()
