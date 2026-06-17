import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will replace the contents inside <section id="problem"> 
# from the beginning to the Closing Message Box.

# We need to extract the bottom parts (Task 5 and below) to keep them intact.
# Look for '<!-- ✅ Task 5: 대기업 상생 ESG 솔루션 킬러 하이라이트'
bottom_start = html.find('<!-- ✅ Task 5: 대기업 상생 ESG 솔루션 킬러 하이라이트')

bottom_parts = html[bottom_start:html.find('</section>', bottom_start)]

new_intro = """      <div class="mb-12">
        <p class="body-md text-ink-700 leading-relaxed" style="word-break:keep-all;">
          대한민국은 조선, 건설, 플랜트, 반도체, 방산 등 세계적인 산업 경쟁력을 보유하고 있습니다.<br>
          하지만 이러한 경쟁력은 수십 년 동안 현장을 지켜온 기술자들의 경험과 숙련 위에서 만들어졌습니다.<br><br>
          지금 산업 현장은 숙련 기술자의 은퇴, 청년 기술자 감소, 외국인 인력 증가라는 구조적 변화에 직면해 있습니다.<br>
          기술 전수와 경력 관리 체계가 부족한 상황에서 현장의 경험과 숙련이 다음 세대로 이어지지 못한다면 대한민국 산업 경쟁력 역시 약화될 수 있습니다.<br><br>
          <strong>MONO는 기술자의 경험을 기록하고 연결하여 산업의 중요한 자산이 다음 세대로 이어질 수 있는 기반을 만들고자 합니다.</strong>
        </p>
      </div>"""

new_challenges = """      <div class="mt-16 mb-12">
        <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-8 flex items-center gap-3">
          <i class="fa-solid fa-triangle-exclamation text-tech-600"></i> 현장이 직면한 5가지 핵심 과제와 MONO의 역할
        </h3>
        <div class="grid grid-cols-1 gap-6">
          <!-- 과제 01 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
            <div class="md:w-1/2 flex flex-col justify-start">
              <span class="text-ink-500 font-mono font-bold text-xs mb-1 block">과제 01</span>
              <h4 class="text-lg font-extrabold text-ink-900 mb-3" style="word-break:keep-all;">기술 전수의 단절</h4>
              <p class="body-sm text-ink-700 leading-relaxed" style="word-break:keep-all;">
                대한민국 산업 경쟁력은 수십 년 동안 축적된 기술자들의 경험과 숙련 위에 만들어졌습니다.<br>
                하지만 숙련 기술자의 은퇴가 증가하고 있으며 현장의 기술과 노하우가 체계적으로 기록되지 못한 채 사라지고 있습니다.
              </p>
            </div>
            <div class="hidden md:block w-px bg-ink-900/10"></div>
            <div class="md:w-1/2 flex flex-col justify-start">
              <div class="inline-flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO의 역할</span>
                <span class="text-[14px] font-bold text-ink-900 font-mono">기술 경험 데이터 자산화</span>
              </div>
              <ul class="list-disc pl-5 text-[13px] text-ink-800 space-y-1 mb-4 font-bold">
                <li>경력 기록</li>
                <li>작업 이력 관리</li>
                <li>기술 포트폴리오 구축</li>
                <li>교육 이력 관리</li>
                <li>숙련 기술의 디지털 자산화</li>
              </ul>
              <p class="body-sm text-tech-800 font-bold bg-tech-50 p-3 lcorner border border-tech-200" style="word-break:keep-all;">
                기술자의 경험이 사라지지 않고 다음 세대로 이어질 수 있는 기반을 구축합니다.
              </p>
            </div>
          </div>

          <!-- 과제 02 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
            <div class="md:w-1/2 flex flex-col justify-start">
              <span class="text-ink-500 font-mono font-bold text-xs mb-1 block">과제 02</span>
              <h4 class="text-lg font-extrabold text-ink-900 mb-3" style="word-break:keep-all;">청년 기술자 감소와 성장 경로 부재</h4>
              <p class="body-sm text-ink-700 leading-relaxed" style="word-break:keep-all;">
                많은 청년들이 기술직의 성장 가능성과 미래 비전을 체감하지 못하고 있습니다.<br>
                기술자는 산업의 핵심 인재임에도 불구하고 체계적인 성장 경로가 부족합니다.
              </p>
            </div>
            <div class="hidden md:block w-px bg-ink-900/10"></div>
            <div class="md:w-1/2 flex flex-col justify-start">
              <div class="inline-flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO의 역할</span>
                <span class="text-[14px] font-bold text-ink-900 font-mono">미래 기술 장인 육성</span>
              </div>
              <ul class="list-disc pl-5 text-[13px] text-ink-800 space-y-1 mb-4 font-bold">
                <li>기술 등급 체계</li>
                <li>경력 성장 로드맵</li>
                <li>교육 연계</li>
                <li>자격 관리</li>
                <li>미래 Tech-Blue 육성</li>
              </ul>
              <p class="body-sm text-tech-800 font-bold bg-tech-50 p-3 lcorner border border-tech-200" style="word-break:keep-all;">
                기술직이 평생 성장 가능한 전문 직업으로 자리 잡을 수 있도록 지원합니다.
              </p>
            </div>
          </div>

          <!-- 과제 03 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
            <div class="md:w-1/2 flex flex-col justify-start">
              <span class="text-ink-500 font-mono font-bold text-xs mb-1 block">과제 03</span>
              <h4 class="text-lg font-extrabold text-ink-900 mb-3" style="word-break:keep-all;">외국인 중심 산업 구조와 기술 정착 문제</h4>
              <p class="body-sm text-ink-700 leading-relaxed" style="word-break:keep-all;">
                외국인 기술자는 이미 산업 현장의 중요한 구성원이 되었습니다.<br>
                그러나 기술 교육, 경력 관리, 정착 지원, 장기 성장 체계는 아직 충분하지 않습니다.
              </p>
            </div>
            <div class="hidden md:block w-px bg-ink-900/10"></div>
            <div class="md:w-1/2 flex flex-col justify-start">
              <div class="inline-flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO의 역할</span>
                <span class="text-[14px] font-bold text-ink-900 font-mono">글로벌 기술자 성장 플랫폼</span>
              </div>
              <ul class="list-disc pl-5 text-[13px] text-ink-800 space-y-1 mb-4 font-bold">
                <li>해외 인재 확보</li>
                <li>비자 정보 제공</li>
                <li>국내 정착 지원</li>
                <li>기술 교육 지원</li>
                <li>글로벌 경력 관리</li>
              </ul>
              <p class="body-sm text-tech-800 font-bold bg-tech-50 p-3 lcorner border border-tech-200" style="word-break:keep-all;">
                내국인과 외국인 기술자가 함께 성장할 수 있는 산업 생태계를 구축합니다.
              </p>
            </div>
          </div>

          <!-- 과제 04 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
            <div class="md:w-1/2 flex flex-col justify-start">
              <span class="text-ink-500 font-mono font-bold text-xs mb-1 block">과제 04</span>
              <h4 class="text-lg font-extrabold text-ink-900 mb-3" style="word-break:keep-all;">기술자의 경험은 자산이 되지 못함</h4>
              <p class="body-sm text-ink-700 leading-relaxed" style="word-break:keep-all;">
                현장의 경험과 성실한 근무 기록은 중요한 가치임에도 불구하고 금융, 복지, 교육 기회로 충분히 연결되지 못하고 있습니다.
              </p>
            </div>
            <div class="hidden md:block w-px bg-ink-900/10"></div>
            <div class="md:w-1/2 flex flex-col justify-start">
              <div class="inline-flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO의 역할</span>
                <span class="text-[14px] font-bold text-ink-900 font-mono">신뢰 데이터 플랫폼</span>
              </div>
              <ul class="list-disc pl-5 text-[13px] text-ink-800 space-y-1 mb-4 font-bold">
                <li>근무 이력 관리</li>
                <li>경력 인증</li>
                <li>금융 신뢰 데이터 구축</li>
                <li>보험 및 금융 연계</li>
                <li>성장 혜택 연결</li>
              </ul>
              <p class="body-sm text-tech-800 font-bold bg-tech-50 p-3 lcorner border border-tech-200" style="word-break:keep-all;">
                기술자의 경험이 새로운 기회로 이어질 수 있도록 지원합니다.
              </p>
            </div>
          </div>

          <!-- 과제 05 -->
          <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8 flex flex-col md:flex-row md:items-stretch gap-6">
            <div class="md:w-1/2 flex flex-col justify-start">
              <span class="text-ink-500 font-mono font-bold text-xs mb-1 block">과제 05</span>
              <h4 class="text-lg font-extrabold text-ink-900 mb-3" style="word-break:keep-all;">미래 산업 전환 준비 부족</h4>
              <p class="body-sm text-ink-700 leading-relaxed" style="word-break:keep-all;">
                AI와 로봇 기술은 점차 산업 현장으로 확산되고 있습니다.<br>
                하지만 현장의 경험과 데이터가 축적되지 않는다면 미래 기술 역시 제대로 활용될 수 없습니다.
              </p>
            </div>
            <div class="hidden md:block w-px bg-ink-900/10"></div>
            <div class="md:w-1/2 flex flex-col justify-start">
              <div class="inline-flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-tech-100 text-tech-900 border border-tech-900/15 lcorner">MONO의 역할</span>
                <span class="text-[14px] font-bold text-ink-900 font-mono">Tech-Blue 인프라 구축</span>
              </div>
              <ul class="list-disc pl-5 text-[13px] text-ink-800 space-y-1 mb-4 font-bold">
                <li>AI 협업 환경 구축</li>
                <li>현장 데이터 축적</li>
                <li>로보틱스 운영 기반 마련</li>
                <li>디지털 기술자 육성</li>
              </ul>
              <p class="body-sm text-tech-800 font-bold bg-tech-50 p-3 lcorner border border-tech-200" style="word-break:keep-all;">
                기술자의 경험이 미래 산업 혁신의 기반이 되도록 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </div>"""

closing_quote = """      <!-- Closing Message Box -->
      <div class="mt-8 mb-12 p-8 md:p-10 bg-warm-100 border border-ink-900/15 lcorner shadow-neo-soft relative overflow-hidden text-center max-w-4xl mx-auto">
        <i class="fa-solid fa-quote-left text-3xl text-ink-200 mb-6 block"></i>
        <h4 class="text-xl md:text-2xl font-black text-ink-900 mb-6" style="word-break: keep-all; line-height: 1.4;">
          대한민국 산업 경쟁력의 시작은 기술자입니다.
        </h4>
        <p class="text-[15px] md:text-[17px] text-ink-800 font-bold leading-relaxed mb-6" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 기록되며,<br class="hidden md:block">
          그 경험이 더 좋은 일자리와 성장 기회, 금융 혜택, 글로벌 기회, 그리고 미래 기술의 기반이 될 수 있도록 연결합니다.
        </p>
        <p class="text-lg md:text-xl font-black text-tech-700" style="word-break: keep-all;">
          우리는 기술자의 경험이 개인의 경력을 넘어 대한민국 산업의 자산이 되는 세상을 만들고자 합니다.
        </p>
      </div>"""

new_section = f"""<section id="problem" class="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-warm-50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10">
    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label text-xl md:text-2xl font-black mb-6"><span class="num text-[16px] md:text-[18px] px-3 py-1">02</span> MONO가 만들고 싶은 변화</div>
      <h2 class="h-display text-ink-900 mb-8" style="word-break: keep-all; ">대한민국 산업 경쟁력의 핵심인 기술과 숙련이 다음 세대로 이어질 수 있도록</h2>
{new_intro}
    </div>

    <div class="reveal">
{new_challenges}
{closing_quote}
{bottom_parts}
  </div>
</section>"""

pattern = re.compile(r'<section id="problem".*?</section>', re.DOTALL)
html = pattern.sub(new_section, html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied final overhaul to section 2.")
