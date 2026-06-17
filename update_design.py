import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """          <!-- Main Copy & Subtext -->
          <div class="grid lg:grid-cols-12 gap-8 items-stretch mb-10">
            <div class="lg:col-span-6 flex flex-col justify-center">
              <blockquote class="relative pl-5 border-l-4 border-ink-900">
                <p class="text-[1.3rem] md:text-[1.5rem] font-black text-ink-900 leading-snug tracking-tight" style="word-break: keep-all;">
                  "좋은 현장은 더 많은 사람이 오래 일할 수 있는 환경에서 시작됩니다. 안전과 다양성은 산업 경쟁력의 일부입니다."
                </p>
              </blockquote>
              <p class="body-md text-ink-700 mt-5 leading-relaxed" style="word-break: keep-all;">
                대한민국 핵심 산업 현장은 숙련공 부족과 고령화가 급격히 심화되고 있습니다. 산업 경쟁력을 유지하려면 청년, 여성, 경력전환 인력 등 <strong>더 다양한 기술 인재가 누구나 안전하게 성장 가능한 현장</strong>이 조성되어야 합니다. MONO는 단순히 부족한 사람을 쪼개 쓰는 매칭 앱이 아닌, 새로운 인재 풀을 현장으로 끌어들이고 장기 체류하도록 돕는 필수적인 ESG 상생 인프라입니다.
              </p>
            </div>

            <!-- UI Schematic: MONO Safety Profile Diagram -->
            <div class="lg:col-span-6 bg-warm-50 border border-ink-900/10 p-6 md:p-8 lcorner shadow-blueprint-sm flex flex-col justify-between relative overflow-hidden group">
              <div class="absolute inset-0 blueprint opacity-[0.03] pointer-events-none"></div>
              
              <div>
                <div class="flex items-center justify-between mb-6 pb-3 border-b border-ink-900/5">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 bg-tech-700 rounded-full animate-pulse"></span>
                    <span class="text-xs font-mono font-bold text-ink-600">MONO SAFETY PROFILE ENGINE</span>
                  </div>
                  <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-warm-50 text-ink-900 border border-ink-900/20 rounded">v1.2 Active</span>
                </div>

                <!-- 4 Pillars of Safety Profile -->
                <div class="grid grid-cols-2 gap-3 mb-6">
                  <!-- Pillar 1 -->
                  <div class="p-3 bg-warm-50/50 border border-ink-900/5 lcorner hover:border-ink-900 hover:bg-warm-50/10 transition-all duration-300">
                    <div class="text-xs font-bold text-ink-900 font-mono mb-1">01 / SAFETY</div>
                    <div class="text-[13.5px] font-black text-ink-900 flex items-center gap-1.5"><i class="fa-solid fa-shield text-[11px] text-ink-900"></i> 안전 인증</div>
                    <p class="text-[10.5px] text-ink-600 mt-1">일일 교육 및 안전 규정 준수 실시간 공인</p>
                  </div>
                  <!-- Pillar 2 -->
                  <div class="p-3 bg-warm-50/50 border border-ink-900/5 lcorner hover:border-ink-900 hover:bg-warm-50/10 transition-all duration-300">
                    <div class="text-xs font-bold text-ink-900 font-mono mb-1">02 / LOAD</div>
                    <div class="text-[13.5px] font-black text-ink-900 flex items-center gap-1.5"><i class="fa-solid fa-gauge-high text-[11px] text-ink-900"></i> 작업 강도 기록</div>
                    <p class="text-[10.5px] text-ink-600 mt-1">근무 중 수집된 가동량 및 육체 부하 정량화</p>
                  </div>
                  <!-- Pillar 3 -->
                  <div class="p-3 bg-warm-50/50 border border-ink-900/5 lcorner hover:border-ink-900 hover:bg-warm-50/10 transition-all duration-300">
                    <div class="text-xs font-bold text-ink-900 font-mono mb-1">03 / DISPATCH</div>
                    <div class="text-[13.5px] font-black text-ink-900 flex items-center gap-1.5"><i class="fa-solid fa-route text-[11px] text-ink-900"></i> 위험도 기반 배치</div>
                    <p class="text-[10.5px] text-ink-600 mt-1">강도/성향에 맞춘 최적 현장·공정 알고리즘 매칭</p>
                  </div>
                  <!-- Pillar 4 -->
                  <div class="p-3 bg-warm-50/50 border border-ink-900/5 lcorner hover:border-ink-900 hover:bg-warm-50/10 transition-all duration-300">
                    <div class="text-xs font-bold text-ink-900 font-mono mb-1">04 / SUPPORT</div>
                    <div class="text-[13.5px] font-black text-ink-900 flex items-center gap-1.5"><i class="fa-solid fa-house-chimney text-[11px] text-ink-900"></i> 숙소/이동/편의 정보</div>
                    <p class="text-[10.5px] text-ink-600 mt-1">원거리 거주자를 위한 맞춤 복지 및 편의시설 제공</p>
                  </div>
                </div>

                <!-- Central Result Block -->
                <div class="p-4 bg-warm-50 border border-ink-200 lcorner flex items-center justify-between gap-4 group-hover:bg-warm-100/50 transition-colors duration-300">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-warm-100 text-ink-900 border border-ink-900/15 grid place-items-center"><i class="fa-solid fa-users-gear text-sm"></i></div>
                    <div>
                      <div class="text-[11px] font-mono tracking-widest text-ink-900 font-bold">결과 도출 (ESG OUTCOME)</div>
                      <div class="text-[14px] font-black text-ink-900 mt-0.5">"누구나 오래 일할 수 있는 환경 구축"</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-circle-check text-ink-900 text-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Message Cards -->
      <div class="grid md:grid-cols-3 gap-6 stagger">
        <div class="bg-warm-50 border border-ink-900/15 p-6 lcorner hover-lift shadow-blueprint">
          <h4 class="h-card text-ink-900 mb-3">미래 인재 육성과 산업 인프라 설계</h4>
          <p class="body-sm text-ink-700">"좋은 산업은 좋은 기술자에서 시작됩니다. MONO는 미래 인재 육성과 신뢰 기반 산업 인프라를 설계합니다."</p>
        </div>
        <div class="bg-warm-50 border border-ink-900/15 p-6 lcorner hover-lift shadow-blueprint">
          <h4 class="h-card text-ink-900 mb-3">대립을 넘어선 동반 성장</h4>
          <p class="body-sm text-ink-700">"MONO는 기업과 기술자가 대립하지 않는, 함께 성장하는 산업 상생 인프라를 만듭니다."</p>
        </div>
        <div class="bg-warm-50 border border-ink-900/15 p-6 lcorner hover-lift shadow-blueprint">
          <h4 class="h-card text-ink-900 mb-3">안정적인 인력 데이터 인프라</h4>
          <p class="body-sm text-ink-700">"지속 가능한 산업 경쟁력은 결국 안정적인 기술 인력 데이터에서 시작됩니다."</p>
        </div>
      </div>
      </div>
    <!-- //상생 산업 인프라 통합 END -->"""

replacement = """          <!-- Main Copy & Subtext -->
          <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16">
            <div class="lg:col-span-5 flex flex-col justify-center">
              <blockquote class="relative">
                <i class="fa-solid fa-quote-left text-3xl text-tech-300 mb-4 opacity-50"></i>
                <p class="text-[1.5rem] md:text-[1.75rem] font-black text-ink-900 leading-[1.4] tracking-tight mb-6" style="word-break: keep-all;">
                  "좋은 현장은 더 많은 사람이 오래 일할 수 있는 환경에서 시작됩니다.<br/>
                  <span class="text-tech-700">안전과 다양성은 산업 경쟁력의 일부입니다.</span>"
                </p>
              </blockquote>
              <div class="h-px w-16 bg-tech-600/30 mb-6"></div>
              <p class="text-base md:text-lg text-ink-700 leading-relaxed font-medium" style="word-break: keep-all;">
                대한민국 핵심 산업 현장은 숙련공 부족과 고령화가 급격히 심화되고 있습니다. 산업 경쟁력을 유지하려면 청년, 여성, 경력전환 인력 등 <strong>더 다양한 기술 인재가 누구나 안전하게 성장 가능한 현장</strong>이 조성되어야 합니다. MONO는 단순히 부족한 사람을 쪼개 쓰는 매칭 앱이 아닌, 새로운 인재 풀을 현장으로 끌어들이고 장기 체류하도록 돕는 필수적인 ESG 상생 인프라입니다.
              </p>
            </div>

            <!-- UI Schematic: MONO Safety Profile Diagram -->
            <div class="lg:col-span-7 bg-white border border-ink-900/10 p-6 md:p-10 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div class="absolute inset-0 blueprint opacity-[0.03] pointer-events-none"></div>
              
              <div class="relative z-10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-ink-900/10 gap-3">
                  <div class="flex items-center gap-3">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-tech-600"></span>
                    </span>
                    <span class="text-sm font-mono font-bold text-ink-900 tracking-wide">MONO SAFETY PROFILE ENGINE</span>
                  </div>
                  <span class="px-2.5 py-1 text-xs font-mono font-bold bg-tech-50 text-tech-800 border border-tech-200 rounded-md">v1.2 Active</span>
                </div>

                <!-- 4 Pillars of Safety Profile -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <!-- Pillar 1 -->
                  <div class="p-5 bg-warm-50 border border-ink-900/10 rounded-xl hover:border-tech-400 hover:shadow-md transition-all duration-300">
                    <div class="text-xs font-bold text-tech-600 font-mono mb-2 tracking-widest">01 / SAFETY</div>
                    <div class="text-lg font-black text-ink-900 flex items-center gap-2 mb-2"><i class="fa-solid fa-shield text-tech-600"></i> 안전 인증</div>
                    <p class="text-sm text-ink-600 leading-relaxed">일일 교육 및 안전 규정 준수 실시간 공인</p>
                  </div>
                  <!-- Pillar 2 -->
                  <div class="p-5 bg-warm-50 border border-ink-900/10 rounded-xl hover:border-tech-400 hover:shadow-md transition-all duration-300">
                    <div class="text-xs font-bold text-tech-600 font-mono mb-2 tracking-widest">02 / LOAD</div>
                    <div class="text-lg font-black text-ink-900 flex items-center gap-2 mb-2"><i class="fa-solid fa-gauge-high text-tech-600"></i> 작업 강도 기록</div>
                    <p class="text-sm text-ink-600 leading-relaxed">근무 중 수집된 가동량 및 육체 부하 정량화</p>
                  </div>
                  <!-- Pillar 3 -->
                  <div class="p-5 bg-warm-50 border border-ink-900/10 rounded-xl hover:border-tech-400 hover:shadow-md transition-all duration-300">
                    <div class="text-xs font-bold text-tech-600 font-mono mb-2 tracking-widest">03 / DISPATCH</div>
                    <div class="text-lg font-black text-ink-900 flex items-center gap-2 mb-2"><i class="fa-solid fa-route text-tech-600"></i> 위험도 기반 배치</div>
                    <p class="text-sm text-ink-600 leading-relaxed">강도/성향에 맞춘 최적 현장·공정 알고리즘 매칭</p>
                  </div>
                  <!-- Pillar 4 -->
                  <div class="p-5 bg-warm-50 border border-ink-900/10 rounded-xl hover:border-tech-400 hover:shadow-md transition-all duration-300">
                    <div class="text-xs font-bold text-tech-600 font-mono mb-2 tracking-widest">04 / SUPPORT</div>
                    <div class="text-lg font-black text-ink-900 flex items-center gap-2 mb-2"><i class="fa-solid fa-house-chimney text-tech-600"></i> 숙소/이동/편의 정보</div>
                    <p class="text-sm text-ink-600 leading-relaxed">원거리 거주자를 위한 맞춤 복지 및 편의시설 제공</p>
                  </div>
                </div>

                <!-- Central Result Block -->
                <div class="p-5 bg-tech-900 border border-tech-700 rounded-xl flex items-center justify-between gap-4 shadow-lg group-hover:bg-ink-900 transition-colors duration-300">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-tech-800 text-warm-50 flex items-center justify-center border border-tech-600"><i class="fa-solid fa-users-gear text-xl"></i></div>
                    <div>
                      <div class="text-xs font-mono tracking-widest text-tech-300 font-bold mb-1">결과 도출 (ESG OUTCOME)</div>
                      <div class="text-base md:text-lg font-black text-warm-50">"누구나 오래 일할 수 있는 환경 구축"</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-circle-check text-tech-400 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Message Cards -->
      <div class="grid md:grid-cols-3 gap-6 stagger mt-4">
        <div class="bg-white border border-ink-900/10 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">
          <div class="w-12 h-12 rounded-xl bg-warm-50 text-tech-700 flex items-center justify-center text-2xl mb-6 shadow-sm border border-ink-900/5"><i class="fa-solid fa-seedling"></i></div>
          <h4 class="text-xl font-black text-ink-900 mb-4 leading-snug">미래 인재 육성과<br/>산업 인프라 설계</h4>
          <p class="text-base text-ink-700 leading-relaxed">"좋은 산업은 좋은 기술자에서 시작됩니다. MONO는 미래 인재 육성과 신뢰 기반 산업 인프라를 설계합니다."</p>
        </div>
        <div class="bg-white border border-ink-900/10 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">
          <div class="w-12 h-12 rounded-xl bg-warm-50 text-tech-700 flex items-center justify-center text-2xl mb-6 shadow-sm border border-ink-900/5"><i class="fa-solid fa-handshake-angle"></i></div>
          <h4 class="text-xl font-black text-ink-900 mb-4 leading-snug">대립을 넘어선<br/>동반 성장</h4>
          <p class="text-base text-ink-700 leading-relaxed">"MONO는 기업과 기술자가 대립하지 않는, 함께 성장하는 산업 상생 인프라를 만듭니다."</p>
        </div>
        <div class="bg-white border border-ink-900/10 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">
          <div class="w-12 h-12 rounded-xl bg-warm-50 text-tech-700 flex items-center justify-center text-2xl mb-6 shadow-sm border border-ink-900/5"><i class="fa-solid fa-server"></i></div>
          <h4 class="text-xl font-black text-ink-900 mb-4 leading-snug">안정적인 인력<br/>데이터 인프라</h4>
          <p class="text-base text-ink-700 leading-relaxed">"지속 가능한 산업 경쟁력은 결국 안정적인 기술 인력 데이터에서 시작됩니다."</p>
        </div>
      </div>
      </div>
    <!-- //상생 산업 인프라 통합 END -->"""

if target in html:
    html = html.replace(target, replacement)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Design updated successfully!")
else:
    print("Could not find the target HTML snippet.")
