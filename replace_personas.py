import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

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
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-safety-tape text-ink-900">청년 기술자 · 10-20대</div><div class="chip bg-tech-700 text-warm-50">The Seed Camp</div></div>
            <h3 class="h-section text-ink-900 mb-3">수능 후, 내 손으로 만드는 첫 1,000만 원의 독립.</h3>
            <p class="body-md text-ink-700 text-justify">수능이 끝난 청년들이 무방비한 험한 단순 노동에 노출되는 대신, 스마트 스킬과 최첨단 안전 교육을 이수합니다. 모노 아카데미를 통해 8주간의 출역을 완수하고, 땀 흘린 정직한 보상으로 스스로 첫 독립 종잣돈(Seed Money) 1,000만 원을 당당히 벌어내는 진짜 어른의 자립 이야기입니다.</p>
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
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-tech-50 border border-tech-700/30 text-tech-800">숙련 기술자 · 30-40대</div><div class="chip bg-tech-700 text-warm-50">Tech-Passport</div></div>
            <h3 class="h-section text-ink-900 mb-3">평생의 땀방울이 곧 영문 기술 여권이자 신용 자산이 되다.</h3>
            <p class="body-md text-ink-700 text-justify">국내 현장에서 평생 쌓아올린 소중한 땀방울과 경력이 공인된 기술 여권(Tech-Passport)과 영문 경력 증명서로 변환됩니다. 단순한 경력을 넘어, 글로벌 고소득 워홀 현장으로의 진출 기회를 열어주며, 투명하게 기록된 성실도는 제1금융권의 대출 기회와 한도 우대라는 강력한 신용 자산으로 돌아옵니다.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">영문 경력 증명서</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">글로벌 워홀 매칭</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">제1금융권 대출 한도 확대</span>
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
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-tech-50 border border-tech-700/30 text-tech-800">외국인 기술자 · K-Work</div><div class="chip bg-tech-700 text-warm-50">Safe K-Work</div></div>
            <h3 class="h-section text-ink-900 mb-3">AI 다국어 비서로 안전을 지키고, 합법 체류의 길을 열다.</h3>
            <p class="body-md text-ink-700 text-justify">언어 장벽으로 인한 현장의 치명적인 위험사고를 AI 다국어 반장 시스템이 실시간으로 통역하고 제거합니다. 에스크로를 통한 100% 안전 정산으로 임금 체불의 두려움을 없애고, 쌓인 성실 출역 데이터는 합법적인 E-7-4(숙련기능인력) 비자 발급의 핵심 가점 자료로 무상 에스코트되어 외국인 노동자의 정당한 권리와 생존을 지킵니다.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">AI 다국어 반장</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">위험 사고 제거</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">E-7-4 비자 가점 에스코트</span>
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
            <div class="flex flex-wrap items-center gap-2 mb-4"><div class="chip bg-safety-rust text-warm-50">은퇴 기술자 · 50-60대</div><div class="chip bg-tech-700 text-warm-50">Legacy Master</div></div>
            <h3 class="h-section text-ink-900 mb-3">육체적 은퇴는 있어도, 기술 장인으로서의 은퇴는 없다.</h3>
            <p class="body-md text-ink-700 text-justify">신체적 노화로 인해 거친 현장에서 쫓겨나는 대신, 무거운 자재 양중과 고강도 노동은 협업 로봇이 전담합니다. 30년간 쌓아온 명장의 안목과 노하우는 스마트 패드로 품질을 감리하고 로봇을 조율하는 시니어 기술 전문가의 역할로 격상됩니다. 은퇴를 미루고 평생 현직의 권위를 회복하는 따뜻한 기술 교체의 이야기입니다.</p>
            <div class="mt-6 flex flex-wrap gap-1.5">
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">로봇 기반 노동 대체</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">스마트 감리관 격상</span>
              <span class="chip chip-round bg-tech-50 text-tech-700 border border-tech-700/30">평생 현직 인프라</span>
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

start_str = "    <!-- Persona tab bar -->"
end_str = "    <!-- Generational Harmony Box -->"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_personas + "\n" + content[end_idx:]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Personas replaced successfully")
else:
    print("Could not find persona boundaries")
