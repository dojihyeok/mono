with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<!-- 과제 01 -->')
end = html.find('</div>\n        </div>\n      </div>\n      <!-- Closing Message Box -->', start)

new_grid = """<!-- 과제 01 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-tech-600 transition-colors group">
            <div class="flex-1">
              <div class="text-tech-600 font-mono font-bold text-sm tracking-widest mb-2">과제 01</div>
              <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-2">기술 전수의 단절</h4>
              <p class="body-md text-ink-700" style="word-break:keep-all;">기술자의 경험과 노하우가 기록되지 못하고 은퇴와 함께 사라지고 있습니다.</p>
            </div>
            <div class="md:w-12 flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors hidden md:flex">
              <i class="fa-solid fa-arrow-right text-2xl"></i>
            </div>
            <div class="md:hidden flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors">
              <i class="fa-solid fa-arrow-down text-xl"></i>
            </div>
            <div class="flex-1 bg-warm-100 p-5 border border-ink-900/10">
              <div class="text-ink-500 font-mono text-xs tracking-widest mb-1">MONO의 역할</div>
              <h5 class="text-lg font-bold text-ink-900">기술 경험 데이터 자산화</h5>
            </div>
          </div>

          <!-- 과제 02 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-tech-600 transition-colors group">
            <div class="flex-1">
              <div class="text-tech-600 font-mono font-bold text-sm tracking-widest mb-2">과제 02</div>
              <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-2">청년 기술자 감소</h4>
              <p class="body-md text-ink-700" style="word-break:keep-all;">새로운 세대의 기술 현장 유입이 부족하여 산업의 활력이 저하되고 있습니다.</p>
            </div>
            <div class="md:w-12 flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors hidden md:flex">
              <i class="fa-solid fa-arrow-right text-2xl"></i>
            </div>
            <div class="md:hidden flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors">
              <i class="fa-solid fa-arrow-down text-xl"></i>
            </div>
            <div class="flex-1 bg-warm-100 p-5 border border-ink-900/10">
              <div class="text-ink-500 font-mono text-xs tracking-widest mb-1">MONO의 역할</div>
              <h5 class="text-lg font-bold text-ink-900">미래 기술 장인 육성</h5>
            </div>
          </div>

          <!-- 과제 03 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-tech-600 transition-colors group">
            <div class="flex-1">
              <div class="text-tech-600 font-mono font-bold text-sm tracking-widest mb-2">과제 03</div>
              <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-2">외국인 중심 산업 구조</h4>
              <p class="body-md text-ink-700" style="word-break:keep-all;">외국인 인력 의존도가 높아지며, 체계적인 관리와 동반 성장이 필요합니다.</p>
            </div>
            <div class="md:w-12 flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors hidden md:flex">
              <i class="fa-solid fa-arrow-right text-2xl"></i>
            </div>
            <div class="md:hidden flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors">
              <i class="fa-solid fa-arrow-down text-xl"></i>
            </div>
            <div class="flex-1 bg-warm-100 p-5 border border-ink-900/10">
              <div class="text-ink-500 font-mono text-xs tracking-widest mb-1">MONO의 역할</div>
              <h5 class="text-lg font-bold text-ink-900">글로벌 기술자 성장 플랫폼</h5>
            </div>
          </div>

          <!-- 과제 04 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-tech-600 transition-colors group">
            <div class="flex-1">
              <div class="text-tech-600 font-mono font-bold text-sm tracking-widest mb-2">과제 04</div>
              <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-2">기술자 경험 비자산화</h4>
              <p class="body-md text-ink-700" style="word-break:keep-all;">수많은 경험이 데이터로 남지 못해 개인과 산업의 자산이 되지 못합니다.</p>
            </div>
            <div class="md:w-12 flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors hidden md:flex">
              <i class="fa-solid fa-arrow-right text-2xl"></i>
            </div>
            <div class="md:hidden flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors">
              <i class="fa-solid fa-arrow-down text-xl"></i>
            </div>
            <div class="flex-1 bg-warm-100 p-5 border border-ink-900/10">
              <div class="text-ink-500 font-mono text-xs tracking-widest mb-1">MONO의 역할</div>
              <h5 class="text-lg font-bold text-ink-900">신뢰 데이터 플랫폼</h5>
            </div>
          </div>

          <!-- 과제 05 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-tech-600 transition-colors group">
            <div class="flex-1">
              <div class="text-tech-600 font-mono font-bold text-sm tracking-widest mb-2">과제 05</div>
              <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-2">미래 산업 전환 준비 부족</h4>
              <p class="body-md text-ink-700" style="word-break:keep-all;">AI 및 로봇 기술 도입에 대비한 현장 맞춤형 데이터와 기술 인프라가 부족합니다.</p>
            </div>
            <div class="md:w-12 flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors hidden md:flex">
              <i class="fa-solid fa-arrow-right text-2xl"></i>
            </div>
            <div class="md:hidden flex justify-center text-ink-300 group-hover:text-tech-600 transition-colors">
              <i class="fa-solid fa-arrow-down text-xl"></i>
            </div>
            <div class="flex-1 bg-warm-100 p-5 border border-ink-900/10">
              <div class="text-ink-500 font-mono text-xs tracking-widest mb-1">MONO의 역할</div>
              <h5 class="text-lg font-bold text-ink-900">Tech-Blue 및 보조 기술 인프라</h5>
            </div>
          </div>\n"""

if start != -1 and end != -1:
    html = html[:start] + new_grid + html[end:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Section 02 grid rewritten successfully.")
else:
    print(f"Could not find start ({start}) or end bounds ({end}).")
