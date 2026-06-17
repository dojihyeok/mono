import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_section = """      <!-- 3. MONO Evolution 흐름도 개선 -->
      <div class="mb-10">
        <h3 class="text-2xl font-black text-ink-900 mb-3">MONO Evolution</h3>
        <p class="body-lg text-ink-800 leading-relaxed max-w-3xl">
          MONO는 기술자의 경험을 기록하는 것에서 시작합니다. 그리고 축적된 데이터를 통해 산업 현장의 문제를 이해하고, 그 문제를 해결할 수 있는 미래 기술을 연결합니다.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 01</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">기술자 경험</h3>
          <p class="text-sm text-ink-800">현장의 기록과 노하우</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 02</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">경력 및 신뢰 데이터</h3>
          <p class="text-sm text-ink-800">대안 신용과 검증된 이력</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 03</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">산업 현장 데이터</h3>
          <p class="text-sm text-ink-800">문제점과 필요 기술 식별</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 04</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">산업 인사이트</h3>
          <p class="text-sm text-ink-800">데이터 기반 현장 솔루션</p>
        </article>
      </div>
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 05</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">미래 기술 연결</h3>
          <p class="text-sm text-ink-800">현장 맞춤형 기술 매칭</p>
        </article>
        <article class="bg-warm-100 border border-tech-500/50 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 06</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">웨어러블·협업 로봇·전문 장비</h3>
          <p class="text-sm text-ink-800">Tech-Blue 인프라 구축</p>
        </article>
        <article class="bg-tech-900 text-white shadow-sm p-6 rounded-lg">
          <div class="text-tech-400 font-mono font-bold text-sm mb-2">STEP 07</div>
          <h3 class="text-xl font-black mb-2">산업 혁신</h3>
          <p class="text-sm text-warm-100">대한민국 산업 경쟁력 강화</p>
        </article>
      </div>"""

new_section = """      <!-- 3. MONO Robot Innovation 흐름도 개선 -->
      <div class="mb-12 reveal">
        <h3 class="text-2xl md:text-3xl font-black text-ink-900 mb-3">MONO Robot Innovation <span class="text-tech-600">단계별 흐름도</span></h3>
        <p class="body-lg text-ink-800 leading-relaxed max-w-3xl">
          MONO는 현장의 노하우를 데이터로 축적하여, 최종적으로 협업 로봇과 웨어러블 등 첨단 기술이 융합된 혁신적 인프라를 완성합니다.
        </p>
      </div>

      <div class="relative mb-20 reveal">
        <!-- Connecting Line for desktop -->
        <div class="hidden lg:block absolute top-[52px] left-0 w-full h-1 bg-tech-200/50 -z-10"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <article class="relative bg-white border-2 border-warm-200 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-sm shadow-md">1</div>
            <h3 class="text-[17px] font-black text-ink-900 mb-2 mt-2">기술자 경험 기록</h3>
            <p class="text-sm text-ink-700 leading-relaxed">현장의 노하우와 숙련도가 앱을 통해 데이터로 축적</p>
          </article>
          <article class="relative bg-white border-2 border-warm-200 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-sm shadow-md">2</div>
            <h3 class="text-[17px] font-black text-ink-900 mb-2 mt-2">신뢰 기반 데이터화</h3>
            <p class="text-sm text-ink-700 leading-relaxed">경력 증명 및 대안 신용 모델 구축</p>
          </article>
          <article class="relative bg-white border-2 border-warm-200 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-sm shadow-md">3</div>
            <h3 class="text-[17px] font-black text-ink-900 mb-2 mt-2">현장 문제점 도출</h3>
            <p class="text-sm text-ink-700 leading-relaxed">산업 현장의 구조적 문제 및 필요 기술 식별</p>
          </article>
          <article class="relative bg-white border-2 border-warm-200 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-sm shadow-md">4</div>
            <h3 class="text-[17px] font-black text-ink-900 mb-2 mt-2">데이터 기반 솔루션</h3>
            <p class="text-sm text-ink-700 leading-relaxed">인사이트 분석을 통한 맞춤형 해결 방안 도출</p>
          </article>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article class="relative bg-white border-2 border-warm-200 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-sm shadow-md">5</div>
            <h3 class="text-[17px] font-black text-ink-900 mb-2 mt-2">미래 첨단 기술 매칭</h3>
            <p class="text-sm text-ink-700 leading-relaxed">각 현장에 가장 최적화된 하드웨어 및 SW 기술 연결</p>
          </article>
          <article class="relative bg-warm-100 border-2 border-tech-500 shadow-neo-hover p-6 rounded-xl hover:-translate-y-1 transition-all z-10">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-tech-600 text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-white ring-4 ring-tech-200/50">6</div>
            <h3 class="text-lg font-black text-ink-900 mb-2 mt-2">로봇·웨어러블 융합</h3>
            <p class="text-sm text-ink-800 font-medium leading-relaxed">협업 로봇 및 스마트 장비를 통한 Tech-Blue 인프라 완성</p>
            <i class="fa-solid fa-robot absolute bottom-4 right-4 text-4xl text-tech-500/20"></i>
          </article>
          <article class="relative bg-ink-900 text-white border-2 border-ink-800 shadow-neo-soft p-6 rounded-xl hover:-translate-y-1 hover:border-tech-400 transition-all">
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-tech-500 text-white flex items-center justify-center font-black text-sm shadow-md">7</div>
            <h3 class="text-[17px] font-black text-warm-50 mb-2 mt-2">산업 패러다임 혁신</h3>
            <p class="text-sm text-warm-200 leading-relaxed">대한민국 산업 전반의 경쟁력 및 생산성 극대화</p>
          </article>
        </div>
      </div>"""

if old_section in html:
    html = html.replace(old_section, new_section)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed flowchart")
else:
    print("Could not find old section")
