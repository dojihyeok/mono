import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new grid HTML
new_grid = """
        <!-- Roadmap Grid with 6 steps -->
        <div class="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 z-10">

          <!-- Phase 1 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-700/15 border border-tech-700/40 rounded-full group-hover/card:bg-tech-700 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-800 font-mono font-black text-base group-hover/card:text-warm-50 transition-all duration-300">01</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-700 font-extrabold uppercase mb-1.5">1단계</div>
                  <div class="text-[14px] text-ink-800 font-extrabold tracking-tight">현장 데이터 구축</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50/95 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 shadow-blueprint-sm min-h-[220px]">
              <div class="tech-corner-mark"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-700 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>출역 기록</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>근무 이력</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>안전 교육</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>기술 경력</span></li>
              </ul>
            </div>
          </div>

          <!-- Phase 2 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-800/15 border border-tech-800/40 rounded-full group-hover/card:bg-tech-800 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-900 font-mono font-black text-base group-hover/card:text-warm-50 transition-all duration-300">02</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-800 font-extrabold uppercase mb-1.5">2단계</div>
                  <div class="text-[14px] text-ink-800 font-extrabold tracking-tight">신뢰 데이터 구축</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50/95 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 shadow-blueprint-sm min-h-[220px]">
              <div class="tech-corner-mark"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-700 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>현장 평가</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>성실 근무 이력</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>신뢰 점수</span></li>
              </ul>
            </div>
          </div>

          <!-- Phase 3 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-600/15 border border-tech-600/40 rounded-full group-hover/card:bg-tech-600 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-700 font-mono font-black text-base group-hover/card:text-warm-50 transition-all duration-300">03</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-600 font-extrabold uppercase mb-1.5">3단계</div>
                  <div class="text-[14px] text-ink-800 font-extrabold tracking-tight">금융 서비스 연계</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50/95 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 shadow-blueprint-sm min-h-[220px]">
              <div class="tech-corner-mark"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-700 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>우대 금융</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>보험</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>안전한 정산 체계</span></li>
              </ul>
            </div>
          </div>

          <!-- Phase 4 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-700/15 border border-tech-700/40 rounded-full group-hover/card:bg-tech-700 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-800 font-mono font-black text-base group-hover/card:text-warm-50 transition-all duration-300">04</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-700 font-extrabold uppercase mb-1.5">4단계</div>
                  <div class="text-[14px] text-ink-800 font-extrabold tracking-tight">기업 서비스 확대</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50/95 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 shadow-blueprint-sm min-h-[220px]">
              <div class="tech-corner-mark"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-700 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>현장 관리</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>인력 운영</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-600 mt-1"></i><span>투명한 정산 체계</span></li>
              </ul>
            </div>
          </div>

          <!-- Phase 5 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-800/15 border border-tech-800/40 rounded-full group-hover/card:bg-tech-800 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-900 font-mono font-black text-base group-hover/card:text-warm-50 transition-all duration-300">05</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-800 font-extrabold uppercase mb-1.5">5단계</div>
                  <div class="text-[14px] text-ink-800 font-extrabold tracking-tight">Tech-Blue 기반 구축</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50/95 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 shadow-blueprint-sm min-h-[220px]">
              <div class="tech-corner-mark"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-700 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>현장 데이터 활용</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>협업 로봇 연계</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-700 mt-1"></i><span>작업 자동화 지원</span></li>
              </ul>
            </div>
          </div>

          <!-- Phase 6 -->
          <div class="relative flex flex-col group/card">
            <div class="flex items-center justify-between mb-5 px-2 z-10">
              <div class="flex items-center gap-3.5">
                <div class="relative w-10 h-10 rounded-full shadow-sm">
                  <div class="absolute inset-0 bg-warm-50 rounded-full"></div>
                  <div class="absolute inset-0 bg-tech-500/20 border border-tech-500/40 rounded-full group-hover/card:bg-tech-500 transition-all duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center text-tech-400 font-mono font-black text-base group-hover/card:text-ink-900 transition-all duration-300">06</div>
                </div>
                <div>
                  <div class="text-[10px] font-mono tracking-widest text-tech-400 font-extrabold uppercase mb-1.5">6단계</div>
                  <div class="text-[14px] text-ink-900 font-black tracking-tight">미래 산업 확장</div>
                </div>
              </div>
            </div>
            <div class="hyper-glow-box bg-warm-50 text-ink-900 lcorner p-5 sm:p-6 flex flex-col h-full hover-lift transition-all duration-300 border-warm-200 shadow-sm min-h-[220px]">
              <div class="tech-corner-mark border-warm-200"></div>
              <ul class="text-[13.5px] leading-[1.7] space-y-4 text-ink-800 font-semibold relative z-10">
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-500 mt-1"></i><span>협업 로봇 운영</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-500 mt-1"></i><span>기술 데이터 자산화</span></li>
                <li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-tech-500 mt-1"></i><span>수익 공유 모델</span></li>
              </ul>
            </div>
          </div>

        </div><!-- /grid -->"""

# Find the start and end of the old grid
start_str = "<!-- Roadmap Grid with animated connector -->"
end_str = "</div><!-- /grid -->"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    content = content[:start_idx] + new_grid + content[end_idx:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("GTM grid successfully replaced with 6 steps.")
else:
    print("Could not find start or end strings.")

