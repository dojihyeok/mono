import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<div id="personaTabs"')
# find the closing div of personaTabs
next_div = html.find('<div id="personaPanels"', start)

# find the closing div of personaPanels
end = html.find('</div>\n      </div>\n    </div>\n\n    <!-- 4대 핵심 미션 -->', next_div)
if end == -1:
    end = html.find('    <!-- 4대 핵심 미션 -->', next_div)

if end == -1:
    # Try to find the section end
    end = html.find('</section>', next_div)


new_tabs_html = """    <div id="personaTabs" class="flex gap-2 overflow-x-auto pb-3 -mx-6 px-6 md:-mx-0 md:px-0 mb-6 reveal scrollbar-hide" style="scroll-snap-type: x mandatory;">
      <button class="ptab active" onclick="switchPersona(1)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">01</span> 입문
      </button>
      <button class="ptab" onclick="switchPersona(2)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">02</span> 성장
      </button>
      <button class="ptab" onclick="switchPersona(3)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">03</span> 안정
      </button>
      <button class="ptab" onclick="switchPersona(4)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">04</span> 확장
      </button>
      <button class="ptab" onclick="switchPersona(5)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">05</span> 은퇴 이후
      </button>
      <button class="ptab" onclick="switchPersona(6)" style="scroll-snap-align: start;">
        <span class="ptab-num mono text-[11px] text-ink-500">06</span> 자산화
      </button>
    </div>

    <!-- 탭 본문 영역 -->
    <div id="personaPanels" class="grid lg:grid-cols-12 gap-6">
      
      <!-- Panel 1 -->
      <div id="panel-1" class="ppanel active col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">01 · 입문기</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">기술의 시작, 탄탄하게</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">초보 기술자가 현장에 안전하게 진입하고 기본기를 다질 수 있도록 지원합니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">진입 장벽 완화</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-book-open text-tech-600"></i> 필수 교육</div>
                <p class="text-sm text-ink-700 leading-relaxed">현장 진입 전 필수 안전 교육, 기초 기술 교육 프로그램 연계.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-id-card text-tech-600"></i> 자격증 연동</div>
                <p class="text-sm text-ink-700 leading-relaxed">자격증 취득 지원 및 갱신 일정 알림 기능, 디지털 프로필 자동 생성.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-briefcase text-tech-600"></i> 첫 일자리 연결</div>
                <p class="text-sm text-ink-700 leading-relaxed">초보자가 안전하게 일할 수 있는 검증된 현장 위주로 첫 일자리 맞춤 매칭 및 현장 생활 정보(숙소, 식당 등) 제공.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 2 -->
      <div id="panel-2" class="ppanel hidden col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">02 · 성장기</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">경험이 포트폴리오로</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">근무 이력이 곧 개인의 역량 증명서가 되어 더 나은 기회를 만듭니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">커리어 점프</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-chart-line text-tech-600"></i> 경력 관리</div>
                <p class="text-sm text-ink-700 leading-relaxed">현장별 근무 이력을 블록체인 기반으로 투명하게 기록하고 체계화된 경력 증명서 발급.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-star text-tech-600"></i> 기술 등급</div>
                <p class="text-sm text-ink-700 leading-relaxed">근무 기간과 평가를 바탕으로 공정한 기술 등급(기공, 반장 등) 자동 산정 및 인증.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-graduation-cap text-tech-600"></i> 심화 교육</div>
                <p class="text-sm text-ink-700 leading-relaxed">새로운 장비(Tech-Blue) 조작, 로보틱스 기초 교육 등 고부가가치 직군으로의 전환 교육 연계.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 3 -->
      <div id="panel-3" class="ppanel hidden col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">03 · 안정기</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">금융과 복지의 연결</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">성실한 근무 기록이 신뢰 데이터가 되어 금융 혜택으로 이어집니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">생활 인프라 보장</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-piggy-bank text-tech-600"></i> 금융 혜택</div>
                <p class="text-sm text-ink-700 leading-relaxed">플랫폼 내 신뢰 데이터를 기반으로 기술자 전용 대출(전세, 자동차 등) 및 우대 금리 제공 연계.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-shield-halved text-tech-600"></i> 맞춤 보험</div>
                <p class="text-sm text-ink-700 leading-relaxed">현장 특성에 맞춘 상해/실손 보험 연계 및 간편 가입 지원.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-heart text-tech-600"></i> 복지 혜택</div>
                <p class="text-sm text-ink-700 leading-relaxed">건강검진 지원, 가족 복지, 우수 기술자 리워드 프로그램 등을 통해 장기 근무의 동기를 부여합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 4 -->
      <div id="panel-4" class="ppanel hidden col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">04 · 확장기</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">경계를 넘어선 기회</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">대한민국에서의 기술을 무기로 글로벌 현장과 창업으로 도약합니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">글로벌 & 창업</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-earth-americas text-tech-600"></i> 해외 취업</div>
                <p class="text-sm text-ink-700 leading-relaxed">인증된 포트폴리오를 통해 싱가포르, 중동, 호주, 일본 등 글로벌 일자리 매칭 및 비자 발급 지원.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-rocket text-tech-600"></i> 기술 창업</div>
                <p class="text-sm text-ink-700 leading-relaxed">독립적인 팀 구성 지원(디지털 반장), '모두의 창업 오디션'과 연계된 소규모 도급 창업 기회 제공.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-users-gear text-tech-600"></i> 팀 운영</div>
                <p class="text-sm text-ink-700 leading-relaxed">우수 기술자를 직접 선발하여 자신의 크루(팀)를 구성하고 대형 프로젝트를 수주할 수 있는 파트너십 권한 부여.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 5 -->
      <div id="panel-5" class="ppanel hidden col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">05 · 은퇴 이후</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">경험의 사회적 환원</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">현장을 떠난 뒤에도 노하우가 계속해서 가치를 만들어냅니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">마스터 클럽</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-chalkboard-user text-tech-600"></i> 멘토 활동</div>
                <p class="text-sm text-ink-700 leading-relaxed">초보 및 청년 기술자를 위한 1:1 온라인 멘토링, 안전 지도관 활동 지원.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-person-chalkboard text-tech-600"></i> 교육 강사</div>
                <p class="text-sm text-ink-700 leading-relaxed">MONO 기술 아카데미의 실습 강사로 활동하며 현장의 생생한 노하우를 전달.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-hands-holding-circle text-tech-600"></i> 기술 전수</div>
                <p class="text-sm text-ink-700 leading-relaxed">수십 년간 축적된 특수 기술과 문제 해결 노하우를 디지털 콘텐츠(VOD, 매뉴얼)로 제작하여 자산화 및 로열티 지급.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 6 -->
      <div id="panel-6" class="ppanel hidden col-span-12">
        <div class="bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 min-h-[380px]">
          <div class="md:w-1/3 flex flex-col justify-between">
            <div>
              <div class="h-eyebrow text-ink-900 mb-2">06 · 자산화</div>
              <h4 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight mb-4" style="word-break: keep-all;">미래 기술과 상생</h4>
              <p class="body-md text-ink-700 font-bold mb-6" style="word-break: keep-all;">개인의 노동을 넘어, 장비 투자와 지식 기반의 새로운 자산을 구축합니다.</p>
            </div>
            <div class="hidden md:block">
              <span class="chip bg-tech-600 text-warm-50 border-none font-bold">노동의 자본화</span>
            </div>
          </div>
          <div class="hidden md:block w-px bg-ink-900/10"></div>
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-robot text-tech-600"></i> 장비 투자</div>
                <p class="text-sm text-ink-700 leading-relaxed">Tech-Blue(협업 로봇, 웨어러블) 장비의 조각 투자(STO)를 통한 패시브 인컴(수익 공유) 모델 참여.</p>
              </div>
              <div>
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-coins text-tech-600"></i> 기술 연금</div>
                <p class="text-sm text-ink-700 leading-relaxed">자신의 기술 데이터가 AI 로봇 학습에 활용될 경우 발생하는 데이터 로열티 및 기술 연금화.</p>
              </div>
              <div class="sm:col-span-2 mt-2">
                <div class="font-bold text-ink-900 mb-2 flex items-center gap-2"><i class="fa-solid fa-handshake-angle text-tech-600"></i> 수익 공유 모델</div>
                <p class="text-sm text-ink-700 leading-relaxed">기술자가 기여한 생산성 향상 분이 현장의 비용 절감으로 이어질 경우, 절감액의 일부를 기술자와 공유하는 상생 정산 구조 확립.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
"""

# Let's verify end points to be safe
if start != -1 and end != -1:
    html = html[:start] + new_tabs_html + html[end:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Persona tabs replaced successfully.")
else:
    print(f"Could not find boundaries. start: {start}, end: {end}")
