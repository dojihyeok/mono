import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_grid = """
    <!-- Present Value Grid (6-Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger">
      <!-- Card 1 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-file-invoice"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">근무기록 관리</h3>
        <p class="body-sm text-ink-700 text-justify">수기 기록을 모바일 스마트 명세서로 전산화하여 체계적인 경력 관리를 제공합니다.</p>
      </article>

      <!-- Card 2 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">출역 데이터 축적</h3>
        <p class="body-sm text-ink-700 text-justify">GPS 위치 인증 기반 출퇴근 장부로 출역 데이터의 무결성과 신뢰도를 증명합니다.</p>
      </article>

      <!-- Card 3 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">안전 교육 및 보험 이력</h3>
        <p class="body-sm text-ink-700 text-justify">일일 모바일 OJT 교육 이수 및 상해보험 자동 바인딩 이력을 보증하여 안전한 현장을 만듭니다.</p>
      </article>

      <!-- Card 4 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-star"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">현장 평판 및 신뢰 데이터</h3>
        <p class="body-sm text-ink-700 text-justify">무결점 출근율 및 상호 평가 기반 S-Core 지수를 정량화하여 기술자의 신뢰 자산을 구축합니다.</p>
      </article>

      <!-- Card 5 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-building-columns"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">포용 금융 연계</h3>
        <p class="body-sm text-ink-700 text-justify">성실 근무 기록을 금융 데이터로 이관하여 제1금융권 대출 및 한도 우대 혜택과 연동합니다.</p>
      </article>

      <!-- Card 6 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-6 shadow-blueprint flex flex-col h-full border-t-4 border-t-tech-700">
        <div class="w-10 h-10 rounded bg-tech-50 text-tech-700 flex items-center justify-center text-lg mb-4 border border-tech-700/20">
          <i class="fa-solid fa-cloud"></i>
        </div>
        <h3 class="text-lg font-black text-ink-900 mb-2">기업용 서비스 (SaaS)</h3>
        <p class="body-sm text-ink-700 text-justify">에스크로 기반 임금 정산 및 4대 보험 행정 대행을 원클릭으로 해결하는 자동화 솔루션을 제공합니다.</p>
      </article>
    </div>
"""

start_str = '<div class="grid md:grid-cols-2 gap-6 lg:gap-8 stagger">'
end_str = '    <!-- Task 5: B2B ERP Dashboard -->'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_grid + "\n" + content[end_idx:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced grid successfully")
else:
    print("Could not find boundaries")

