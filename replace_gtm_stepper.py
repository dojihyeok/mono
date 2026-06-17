import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_gtm = """
        <!-- Timeline Stepper UI -->
        <div class="relative max-w-4xl mx-auto z-10">
          
          <!-- Vertical Line -->
          <div class="absolute left-[32px] md:left-[40px] top-[40px] bottom-[40px] w-[2px] bg-gradient-to-b from-tech-700/50 via-tech-500/30 to-warm-50/0 z-0 hidden md:block"></div>
          
          <div class="flex flex-col gap-8 md:gap-12 relative z-10">
            <!-- Phase 1 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
                  01
                </div>
              </div>
              <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">Work Data</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">현장 데이터 구축</h3>
                <p class="body-md text-ink-700 leading-relaxed">출역 기록, 근무 이력, 안전 교육 수료 로그, 기술 경력 적재.</p>
              </div>
            </div>

            <!-- Phase 2 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
                  02
                </div>
              </div>
              <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">Trust Data</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">신뢰 데이터 구축</h3>
                <p class="body-md text-ink-700 leading-relaxed">상방/하방 교차 현장 평판 평가, 성실 근무 이력 기반 신뢰 점수(S-Core) 구축.</p>
              </div>
            </div>

            <!-- Phase 3 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
                  03
                </div>
              </div>
              <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">Financial Line</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">금융 서비스 연계</h3>
                <p class="body-md text-ink-700 leading-relaxed">제1금융권 우대 대출 심사 연동, 상해보험 보증, 에스크로 안전 정산 체계 구축.</p>
              </div>
            </div>

            <!-- Phase 4 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
                  04
                </div>
              </div>
              <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">Enterprise SaaS</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기업 서비스 확대</h3>
                <p class="body-md text-ink-700 leading-relaxed">대기업 ERP 안전 컴플라이언스 관제 연동, 하청사 노무 행정 자동화, 실시간 수요 예측 기반 인력 운영.</p>
              </div>
            </div>

            <!-- Phase 5 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-800 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-warm-50 transition-colors duration-500">
                  05
                </div>
              </div>
              <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">Robotics Base</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">Tech-Blue 기반 구축</h3>
                <p class="body-md text-ink-700 leading-relaxed">시공 모션 데이터 가공 활용, 표준 코어 기반 모듈형 협업 로봇 연계, 작업 자동화 물리 보조.</p>
              </div>
            </div>

            <!-- Phase 6 -->
            <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
              <div class="flex-shrink-0 flex items-center md:items-start gap-4">
                <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-500 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-500 group-hover/step:text-warm-50 transition-colors duration-500">
                  06
                </div>
              </div>
              <div class="hyper-glow-box bg-tech-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-tech-500/30 relative">
                <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-tech-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="chip bg-tech-500 text-warm-50 font-bold border border-tech-500">Human + AI Economy</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">미래 산업 확장</h3>
                <p class="body-md text-ink-800 leading-relaxed font-bold">원격 협업 로봇 조율 운영, 은퇴 명장 궤적 상속 기술 데이터 자산화, 기여 비례 배당 수익 공유 모델 전개.</p>
              </div>
            </div>

          </div>
        </div>
"""

start_str = "        <!-- Roadmap Grid with 6 steps -->"
end_str = "        </div><!-- /grid -->"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_str)
    content = content[:start_idx] + new_gtm + content[end_idx:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Stepper replaced successfully")
else:
    print("Could not find grid boundaries")
