import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update GTM Steps
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
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">첫걸음</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 확보</h3>
                <p class="body-md text-ink-700 leading-relaxed mb-2"><strong>가입 절차 간소화:</strong> 복잡한 서류 제출 없이 간편인증 및 공동인증을 통해 건강보험 자격 정보와 주민등록등본을 자동으로 제출하는 간편 가입 화면 구현.</p>
                <p class="body-md text-ink-700 leading-relaxed"><strong>전문 기술자 경력 연동:</strong> 국가 기술 자격증 및 이수 교육 내역 자동 불러오기 기능 시각화.</p>
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
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">연결</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">일자리 연결</h3>
                <p class="body-md text-ink-700 leading-relaxed mb-2"><strong>더 쉬운 일자리 찾기:</strong> 내 주소지 기반 일자리 추천, 기술 분야별 맞춤 일자리, 안전한 숙소 정보 및 일당 비교 검색 도구 구현.</p>
                <p class="body-md text-ink-700 leading-relaxed"><strong>현장 정보 제공:</strong> 오늘 갈 일터의 안전 위험 정보, 교통편, 숙소 상태를 한눈에 보여주는 현장 카드 제공.</p>
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
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">성장</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 성장 지원</h3>
                <p class="body-md text-ink-700 leading-relaxed mb-2"><strong>기술 이력 관리:</strong> 내 근무 이력과 경력 데이터를 평생 가는 개인 기술 포트폴리오 자산으로 저장.</p>
                <p class="body-md text-ink-700 leading-relaxed mb-2"><strong>금융 데이터 활용:</strong> 성실한 출근 도장을 대안 신용 등급으로 환산하여 1금융권 우대 대출 프로그램과 자동 연계.</p>
                <p class="body-md text-ink-700 leading-relaxed"><strong>기술 교육 제공:</strong> 기초 기술 교육, 안전 교육 및 은퇴 장인의 숙련 기술 전수 클래스 연계.</p>
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
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">동행</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">파트너사 확보</h3>
                <p class="body-md text-ink-700 leading-relaxed mb-2"><strong>채용 공고 간소화:</strong> 구인 기업 및 하청 소장님이 반복 채용할 수 있는 간편 템플릿 제공.</p>
                <p class="body-md text-ink-700 leading-relaxed"><strong>행정 업무 지원:</strong> 출근 여부 확인, 전자 근로계약 체결, 정산 및 안전 교육 이수증 원스톱 관리 대시보드 구현.</p>
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
                  <span class="chip bg-tech-50 text-tech-700 border border-tech-700/30">안정</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">고용 안정화</h3>
                <p class="body-md text-ink-700 leading-relaxed"><strong>정규직 채용 전환 지원:</strong> 오래 함께 일한 우수 근로자를 원청/하청 기업의 정규직 기술자로 안전하게 연계하는 사다리 마련.</p>
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
                  <span class="chip bg-tech-500 text-warm-50 font-bold border border-tech-500">도약</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">글로벌 확장</h3>
                <p class="body-md text-ink-800 leading-relaxed font-bold"><strong>해외 근무 지원:</strong> K-기술 경력을 글로벌 표준 규격으로 자동 번역하여 해외 우수 일자리 및 장기 체류 비자 발급 가이드 지원.</p>
              </div>
            </div>

          </div>
        </div>
"""

start_gtm = "        <!-- Timeline Stepper UI -->"
end_gtm = "        </div>\n<!-- ============================== S5"
idx1 = content.find(start_gtm)
idx2 = content.find("        </div>\n</section>", idx1)
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_gtm + content[idx2-9:]

# 2. Update Glossary
new_glossary = """
    <!-- Glossary Widget -->
    <div class="mt-16 w-full mx-auto reveal">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded bg-ink-900 text-warm-50 flex items-center justify-center text-sm"><i class="fa-solid fa-book"></i></span>
        <h3 class="text-xl font-black text-ink-900 tracking-tight">쉽게 이해하는 용어 사전 <span class="text-[13px] font-normal text-ink-500 ml-2">어려운 용어를 풀어낸 안내판</span></h3>
      </div>
      <div class="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        
        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Alternative CB</div>
          <div class="text-base font-black text-ink-900 mb-3">대안 신용평가</div>
          <p class="body-sm text-ink-700 leading-relaxed">규칙적인 소득 증명이 어려워 대출을 못 받던 기술자를 위해, 성실한 출근 이력을 바탕으로 새롭게 짜여진 금융 신용 평가</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Software as a Service</div>
          <div class="text-base font-black text-ink-900 mb-3">SaaS (기업용 업무관리)</div>
          <p class="body-sm text-ink-700 leading-relaxed">소장님들이 손으로 쓰던 영수증, 출근부, 4대 보험 신고를 클릭 한 번으로 자동 정리해 주는 디지털 비서</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Robot as a Service</div>
          <div class="text-base font-black text-ink-900 mb-3">RaaS (구독형 현장 로봇)</div>
          <p class="body-sm text-ink-700 leading-relaxed">비싼 특수 로봇을 살 필요 없이, 정수기처럼 원하는 기간만큼만 저렴하게 빌려 쓰는 로봇 서비스</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Over The Air</div>
          <div class="text-base font-black text-ink-900 mb-3">OTA (원격 무선 업데이트)</div>
          <p class="body-sm text-ink-700 leading-relaxed">현장에 가지 않고도 스마트폰처럼 무선 네트워크를 통해 로봇의 성능과 인공지능을 실시간 업데이트하는 기술</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start bg-tech-50/50 border-tech-700/30">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Future Master</div>
          <div class="text-base font-black text-ink-900 mb-3">Tech-Blue (미래 기술 장인)</div>
          <p class="body-sm text-ink-700 leading-relaxed">고되고 험한 단순 노동은 로봇에게 맡기고, 스마트 기기로 로봇을 안전하게 조종하고 검증하는 다음 세대의 기술 전문가</p>
        </div>

      </div>
    </div>
"""

idx1 = content.find("    <!-- Glossary Widget -->")
idx2 = content.find("      </div>\n    </div>\n  </div>\n</section>")
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_glossary + content[idx2+21:]

# 3. Update Personas
new_personas = """
    <!-- Persona tab bar -->
    <div id="personaTabs" class="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-6 reveal hide-scrollbar">
      <button data-persona="seed" class="ptab active shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-warm-50 border border-ink-900/15 text-[13px] font-medium text-ink-700 lcorner border-b-2 border-b-tech-700 shadow-sm text-ink-900 bg-tech-50/20">
        <span class="ptab-num mono text-[11px] text-ink-500">01</span> The Seed Camp · 청년 기술자
      </button>
      <button data-persona="passport" class="ptab shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-warm-50 border border-ink-900/15 text-[13px] font-medium text-ink-700 lcorner">
        <span class="ptab-num mono text-[11px] text-ink-500">02</span> Tech-Passport · 숙련 기술자
      </button>
      <button data-persona="safe" class="ptab shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-warm-50 border border-ink-900/15 text-[13px] font-medium text-ink-700 lcorner">
        <span class="ptab-num mono text-[11px] text-ink-500">03</span> Safe K-Work · 외국인 기술자
      </button>
      <button data-persona="legacy" class="ptab shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-warm-50 border border-ink-900/15 text-[13px] font-medium text-ink-700 lcorner">
        <span class="ptab-num mono text-[11px] text-ink-500">04</span> Legacy Master · 은퇴 기술자
      </button>
    </div>

    <!-- Persona panels -->
    <div id="personaPanels" class="grid lg:grid-cols-12 gap-6 reveal">
      
      <!-- Persona 1: The Seed Camp -->
      <div data-persona="seed" class="ppanel lg:col-span-12 bg-warm-50 border border-ink-900/15 lcorner p-7 lg:p-9 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-safety-tape text-ink-900">청년 기술자 · 10-20대</div><div class="chip bg-tech-700 text-warm-50">자립</div></div>
            <h3 class="h-section text-ink-900 mb-3">"알바 대신 스마트 도배를 배웠더니, 내 손으로 천만 원을 모았습니다."</h3>
            <p class="body-md text-ink-700 text-justify">알바 대신 스마트 도배 기술을 배운 20대 청년이, 8주간 땀 흘려 일해 자신의 힘으로 첫 자립 종잣돈 1,000만 원을 통장에 꽂기까지의 기적.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">스마트 스킬 이수</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">8주 현장 출역</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">독립 종잣돈 1,000만 원</span>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="spec-list">
              <div class="row"><div class="k">학습</div><div>스마트 디바이스 조작 및 안전 교육 이수</div></div>
              <div class="row"><div class="k">출역</div><div>8주 단기 마스터 실습 수료</div></div>
              <div class="row"><div class="k">보상</div><div>자립을 위한 종잣돈 1,000만 원 달성</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persona 2: Tech-Passport -->
      <div data-persona="passport" class="ppanel hidden lg:col-span-12 bg-warm-50 border border-ink-900/15 lcorner p-7 lg:p-9 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-tech-50 border border-tech-700/30 text-tech-800">숙련 기술자 · 30-40대</div><div class="chip bg-tech-700 text-warm-50">신뢰</div></div>
            <h3 class="h-section text-ink-900 mb-3">"10년을 일해도 대출 한 장 안 나오던 제가, 당당히 신용을 인정받았습니다."</h3>
            <p class="body-md text-ink-700 text-justify">10년을 일해도 대출 한 장 안 나오던 현장 기술자가, MoNo의 근무 데이터 덕분에 당당히 신용을 인정받고 집 보증금 대출을 받던 감동의 순간.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">투명한 근무 데이터</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">제1금융권 대출 기회</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">당당한 신용의 인정</span>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="spec-list">
              <div class="row"><div class="k">증명</div><div>영문 경력 증명서 및 기술 여권 발급</div></div>
              <div class="row"><div class="k">글로벌</div><div>고소득 글로벌 현장 다이렉트 워홀 매칭</div></div>
              <div class="row"><div class="k">자산</div><div>평판 데이터 기반 1금융권 대출/한도 우대</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persona 3: Safe K-Work -->
      <div data-persona="safe" class="ppanel hidden lg:col-span-12 bg-warm-50 border border-ink-900/15 lcorner p-7 lg:p-9 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-tech-50 border border-tech-700/30 text-tech-800">외국인 기술자 · K-Work</div><div class="chip bg-tech-700 text-warm-50">안전</div></div>
            <h3 class="h-section text-ink-900 mb-3">"말이 안 통해 무서웠던 현장이, 저를 가장 안전하게 지켜주는 안심 일터가 됐습니다."</h3>
            <p class="body-md text-ink-700 text-justify">언어가 안 통해 위험에 노출되던 이주 기술자에게 AI 번역 비서가 안전을 지켜주고, 성실한 경력을 법무부 비자 전환용 가점으로 연동해 준 안심 정착 일터.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">AI 다국어 비서</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">위험 사고 제거</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">E-7-4 비자 가점 연동</span>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="spec-list">
              <div class="row"><div class="k">안전</div><div>AI 다국어 비서를 통한 실시간 위험사고 예방</div></div>
              <div class="row"><div class="k">비자</div><div>출역 데이터 기반 E-7-4 가점 증빙 무상 지원</div></div>
              <div class="row"><div class="k">정산</div><div>에스크로 안전 정산 및 체불 리스크 제로화</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Persona 4: Legacy Master -->
      <div data-persona="legacy" class="ppanel hidden lg:col-span-12 bg-warm-50 border border-ink-900/15 lcorner p-7 lg:p-9 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7">
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-safety-rust text-warm-50">은퇴 기술자 · 50-60대</div><div class="chip bg-tech-700 text-warm-50">상생</div></div>
            <h3 class="h-section text-ink-900 mb-3">"몸이 낡았다고 쫓겨나는 대신, 무거운 짐은 로봇이 지고 저는 명장으로 대우받습니다."</h3>
            <p class="body-md text-ink-700 text-justify">나이 들고 몸이 아파 일터에서 쫓겨나는 대신, 무거운 짐은 로봇이 지고 자신은 스마트 패드로 시공 결과물을 꼼꼼히 검수하며 명장의 존엄을 지키는 노후.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">스마트 패드 검수</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">무거운 짐은 로봇 전담</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">명장의 존엄 회복</span>
            </div>
          </div>
          <div class="lg:col-span-5">
            <div class="spec-list">
              <div class="row"><div class="k">역할</div><div>스마트 패드 기반 품질 감리 및 로봇 조율</div></div>
              <div class="row"><div class="k">노동</div><div>무거운 짐과 위험 노동은 협업 로봇이 전담</div></div>
              <div class="row"><div class="k">지위</div><div>육체적 은퇴 후 시니어 기술 마스터로 존중</div></div>
            </div>
          </div>
        </div>
      </div>

    </div>
"""
idx1 = content.find("    <!-- Persona tab bar -->")
idx2 = content.find("    <!-- Generational Harmony Box -->")
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_personas + content[idx2:]

# 4. Slogan additions
slogans = """
<!-- Slogan Bar -->
<div class="w-full bg-ink-900 text-warm-50 py-12 text-center relative z-20 border-t-4 border-tech-700">
  <div class="max-w-4xl mx-auto px-6">
    <div class="text-xl md:text-2xl font-black mb-4" style="word-break: keep-all;">
      "기술자의 경험은 단순한 경력이 아니라 자산입니다."
    </div>
    <div class="text-lg md:text-xl font-bold text-tech-400 mb-6" style="word-break: keep-all;">
      "MONO는 근무기록을 신뢰로 연결하고, 신뢰를 더 많은 기회와 미래 가치로 연결하는 플랫폼입니다."
    </div>
    <div class="text-base font-medium text-warm-200 mb-6" style="word-break: keep-all;">
      "우리는 사람을 대체하는 기술이 아니라 사람의 가치를 증명하고 보호하는 기술을 만듭니다."
    </div>
    <div class="text-sm font-bold text-tech-600 mt-6 pt-6 border-t border-ink-700" style="word-break: keep-all;">
      "기술자는 더 좋은 일자리를 얻고, 기업은 더 좋은 인재를 확보하며, 산업은 더 안전하고 효율적으로 성장하는 따뜻한 상생 생태계를 만들어 나갑니다."
    </div>
  </div>
</div>
"""
# Replace existing slogan bar
idx1 = content.find("<!-- Slogan Bar -->")
idx2 = content.find("<!-- ============================== FOOTER ============================== -->")
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + slogans + "\n" + content[idx2:]


with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates successful")
