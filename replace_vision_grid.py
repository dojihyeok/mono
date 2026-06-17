import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_vision_grid = """
    <!-- Next MONO 6-Step Vision -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger relative z-10">
      
      <!-- Step 1 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-ink-900/20">01</span>
          <i class="fa-solid fa-triangle-exclamation text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">왜 필요한가 (Why)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">절박한 현장의 위기 극복</h3>
        <p class="body-md text-ink-700 text-justify">고령화, 인력 유실, 안전 붕괴 등 대한민국 기간산업의 절박한 현실을 조명하며, 더 이상 미룰 수 없는 현장의 체질 개선 필요성을 증명합니다.</p>
      </article>

      <!-- Step 2 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-ink-900/20">02</span>
          <i class="fa-solid fa-screwdriver-wrench text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">어떤 문제를 해결하는가 (How)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">로봇 보조와 효율 극대화</h3>
        <p class="body-md text-ink-700 text-justify">고강도 고위험 공정에 로봇 보조를 투입하여 시공 효율성을 극대화하고, 인간의 생명을 구출하며 완벽한 안전 지대를 구축합니다.</p>
      </article>

      <!-- Step 3 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-ink-900/20">03</span>
          <i class="fa-solid fa-database text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">MONO 데이터 중요성 (Data)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">실제 궤적 데이터 독점</h3>
        <p class="body-md text-ink-700 text-justify">로봇의 정밀 모션을 자율 학습시키기 위해, 명장의 오프라인 실제 궤적 데이터를 독점적으로 확보하여 기술 자산의 가치를 증명합니다.</p>
      </article>

      <!-- Step 4 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-ink-900/20">04</span>
          <i class="fa-solid fa-user-astronaut text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">스마트 오퍼레이터 (Tech-Blue)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">새로운 노동 계급의 탄생</h3>
        <p class="body-md text-ink-700 text-justify">단순 노동에서 벗어나 기계를 부리고 통제하는 스마트 오퍼레이터로서, 새로운 노동 계급(Tech-Blue)의 정체성을 정의합니다.</p>
      </article>

      <!-- Step 5 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-ink-900/20">05</span>
          <i class="fa-solid fa-robot text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">모듈형 협업 로봇 (RaaS)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">모듈러 로보틱스 생태계</h3>
        <p class="body-md text-ink-700 text-justify">Core V1 플랫폼에 미장, 양중, 진단 모듈을 작업 목적에 맞게 동적으로 탈부착하는 혁신적인 모듈러 로보틱스 모델을 구현합니다.</p>
      </article>

      <!-- Step 6 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 shadow-blueprint border-b-4 border-tech-700">
        <div class="flex items-start justify-between mb-4">
          <span class="vision-num text-3xl font-black text-tech-700/30">06</span>
          <i class="fa-solid fa-handshake-angle text-tech-700 text-xl"></i>
        </div>
        <div class="h-eyebrow text-tech-700 mb-2">장기 비전 (STO/수익 공유)</div>
        <h3 class="text-lg font-black text-ink-900 mb-3 tracking-tight break-keep">자본과 노동의 상생 경제</h3>
        <p class="body-md text-ink-700 text-justify">개인이 사기 힘든 고가 장비를 공동 펀딩하여 소유하고, 가동 마진을 기여 마스터와 공평하게 나누는 상생형 공유 경제를 실현합니다.</p>
      </article>

    </div>
"""

start_str = "    <div class=\"grid sm:grid-cols-2 gap-6 stagger\">"
end_str = "    <!-- Task 4: Tech-Blue Modular Robotics Simulator -->"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_vision_grid + "\n" + content[end_idx:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Vision grid replaced successfully")
else:
    print("Could not find vision grid boundaries")
