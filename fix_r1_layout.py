import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract R1 card inner HTML
# We can search for the R1 card using a regex or just replace the entire article.
r1_target = re.search(r'(<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">.*?<span class="vstep-dot">1</span>)(.*?)(</article>)', html, re.DOTALL)

if r1_target:
    r1_start = r1_target.group(1)
    r1_inner = r1_target.group(2)
    r1_end = r1_target.group(3)
    
    new_r1_inner = """
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          <!-- Column 1: Title -->
          <div class="lg:col-span-3">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">지역 예선</div>
            <h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>
          </div>
          
          <!-- Column 2: Info -->
          <div class="lg:col-span-5 lg:pl-6 lg:border-l border-ink-900/10">
            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">500명</div>
            </div>
            <div>
              <span class="text-sm font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-[15px] text-ink-800 leading-relaxed space-y-1">
                <div>아이디어 심사 통과 창업 활동 자금 <strong class="text-ink-900">200만원</strong> 지원</div>
                <div>본 라운드(관찰·서면 평가) 통과 후 2라운드 진출 시 <strong class="text-ink-900">초기 시제품 제작비 1천만원</strong> 지원</div>
              </div>
            </div>
          </div>
          
          <!-- Column 3: Summary -->
          <div class="lg:col-span-4 lg:pl-6 lg:border-l border-ink-900/10 flex flex-col justify-start">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-bold text-ink-900">- 내용 요약 -</span>
              <button onclick="document.getElementById('r1-strategy-modal').showModal()" class="text-sm font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1 transition-colors">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> 1라운드 준비 전략 - 상세 보기
              </button>
            </div>
            <div class="bg-transparent">
              <ul class="text-[14px] text-ink-800 space-y-3 list-none p-0 m-0">
                <li class="flex items-start gap-2">
                  <span class="text-tech-500 mt-1 text-[10px]">●</span>
                  <span class="leading-tight"><strong class="text-ink-900 font-bold">핵심 목표:</strong> 완성된 서비스보다 빠르게 배우고 성장하는 과정을 증명</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-tech-500 mt-1 text-[10px]">●</span>
                  <span class="leading-tight"><strong class="text-ink-900 font-bold">멘토링 전략:</strong> 적극적인 피드백 반영 루프 구축 및 실행</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-tech-500 mt-1 text-[10px]">●</span>
                  <span class="leading-tight"><strong class="text-ink-900 font-bold">지원금 활용:</strong> 1R 200만원(MVP 검증) / 2R 진출시 1,000만원(실제 서비스 검증)</span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
"""
    
    html = html.replace(r1_target.group(0), r1_start + new_r1_inner + r1_end)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced R1 layout.")
else:
    print("Could not find R1.")
