import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match the R1 article
r1_target = re.search(r'(<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">.*?<span class="vstep-dot">1</span>\n)(.*?)(</article>)', html, re.DOTALL)

if r1_target:
    r1_start = r1_target.group(1)
    
    new_r1_inner = """        <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
          
          <!-- Column 1: Title -->
          <div class="md:w-1/3">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">지역 예선</div>
            <h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>
          </div>
          
          <!-- Column 2: Info -->
          <div class="md:w-2/3 md:pl-6 lg:border-l border-ink-900/10">
            <div class="mb-5">
              <span class="text-[15px] font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-[28px] font-black text-ink-900">500명</div>
            </div>
            <div>
              <span class="text-[15px] font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-[16px] text-ink-800 leading-relaxed space-y-1.5">
                <div>아이디어 심사 통과 창업 활동 자금 <strong class="text-ink-900">200만원</strong> 지원</div>
                <div>본 라운드(관찰·서면 평가) 통과 후 2라운드 진출 시 <strong class="text-ink-900">초기 시제품 제작비 1천만원</strong> 지원</div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Strategy Summary Box (Full width bottom) -->
        <div class="mt-8 pt-7 border-t border-ink-900/10">
          <div class="flex items-center justify-between mb-5">
            <span class="text-[17px] font-black text-ink-900">1라운드 준비 전략</span>
            <button onclick="document.getElementById('r1-strategy-modal').showModal()" class="text-[15px] font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1.5 transition-colors">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> 상세 보기
            </button>
          </div>
          <div class="bg-transparent">
            <ul class="text-[16px] text-ink-800 space-y-3.5 list-none p-0 m-0">
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">핵심 목표:</strong> 완성된 서비스보다 빠르게 배우고 성장하는 과정을 증명</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">멘토링 전략:</strong> 적극적인 피드백 반영 루프 구축 및 실행</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">규제·투자·네트워크:</strong> 사전 규제 대응 / VC·SI 연계 / 공공·민간 파트너십 구축</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">MVP 및 지원금:</strong> 1R 200만원(MVP 검증) / 2R 진출 시 1,000만원(실제 서비스 검증)</span>
              </li>
            </ul>
          </div>
        </div>
"""
    
    html = html.replace(r1_target.group(0), r1_start + new_r1_inner + "\n      </article>")
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced R1 layout full width.")
else:
    print("Could not find R1.")
