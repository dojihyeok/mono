import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Helper function to generate modal HTML
def generate_modal(modal_id, subtitle, title, sections):
    sections_html = ""
    for sec_title, sec_content in sections:
        sections_html += f"""
        <div class="mb-6">
          <h4 class="text-lg font-bold text-ink-900 mb-3 border-b border-warm-200 pb-2">{sec_title}</h4>
          <div class="text-[15px] text-ink-800 leading-relaxed space-y-3">
            {sec_content}
          </div>
        </div>
        """

    return f"""<dialog class="bg-transparent w-full h-full p-0 m-0 fixed inset-0 z-[100] backdrop:bg-ink-900/50" id="{modal_id}">
  <div class="fixed inset-0 bg-ink-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto" onclick="document.getElementById('{modal_id}').close()">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-neo-hover overflow-hidden relative flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
      <div class="p-6 md:p-8 border-b border-warm-200 flex justify-between items-start bg-white sticky top-0 z-10">
        <div>
          <div class="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{subtitle}</div>
          <h2 class="text-2xl md:text-3xl font-bold text-ink-900">{title}</h2>
        </div>
        <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-warm-100 text-ink-400 hover:text-ink-900 transition-colors" onclick="document.getElementById('{modal_id}').close()">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="p-6 md:p-8 overflow-y-auto text-ink-700 leading-relaxed">
        {sections_html}
      </div>
    </div>
  </div>
</dialog>"""


# Round 1
r1_sections = [
    ("핵심 목표: 문제의 본질 증명", "<p>단순한 '구인구직 앱'이 아닌, <strong>현장 인력 데이터의 파편화와 단절</strong>이라는 근본적인 문제를 해결하는 인프라적 접근임을 심사위원에게 명확히 전달합니다. 왜 기존 방식(밴드, 지인 소개, 인력소)이 한계에 도달했는지 정량적 데이터로 제시합니다.</p>"),
    ("멘토링 및 가설 검증 전략", "<p>MVP(최소 기능 제품) 개발 전, 현장 기술자 50명 및 중소 전문건설사 10곳을 대상으로 <strong>심층 인터뷰(FGI)</strong>를 진행하여 우리의 가설(투명한 프로필이 상호 신뢰를 만든다)이 실제 시장의 Pain-point와 일치하는지 철저히 검증합니다.</p>"),
    ("지원금(200만 원) 활용 계획", "<ul class='list-disc pl-5 space-y-2'><li>초기 시장 검증을 위한 <strong>가짜 문 테스트(Fake Door Test)</strong> 랜딩페이지 구축 및 퍼포먼스 마케팅 (100만 원)</li><li>잠재 고객 인터뷰 및 설문조사 리워드 (50만 원)</li><li>와이어프레임 및 MVP 기획용 디자인 툴/리소스 구독 (50만 원)</li></ul>"),
    ("기대 성과 (1R 통과 기준)", "<p>추측이 아닌 실제 인터뷰와 랜딩페이지 전환율(CVR) 데이터를 기반으로 <strong>'시장 수요가 확실하게 존재함'</strong>을 데이터로 증명하여 2라운드 시제품 제작 당위성을 확보합니다.</p>")
]

# Round 2
r2_sections = [
    ("핵심 목표: 동작하는 데이터 인프라 입증", "<p>기능이 많은 앱이 아니라, <strong>'핵심 가치(Aha Moment)'가 작동하는지</strong>를 증명하는 단계입니다. 기술자가 자신의 경력을 모바일에서 쉽게 데이터화하고, 기업이 이를 열람하여 신뢰를 느끼는 '최소 매칭 사이클'을 구현합니다.</p>"),
    ("주요 기능 (MVP) 집중", "<ul class='list-disc pl-5 space-y-2'><li><strong>간편 프로필 빌더:</strong> 복잡한 이력서 대신, 현장에 특화된 태그(공종, 연차, 자격증, 안전교육 이수 여부) 기반의 원터치 프로필 생성.</li><li><strong>B2B 열람 시스템:</strong> 기업이 특정 조건(예: 형틀목수, 10년 이상, 서울)으로 신뢰할 수 있는 데이터를 검색하고 열람하는 인터페이스.</li></ul>"),
    ("추가 지원금(최대 1천만 원) 활용 계획", "<ul class='list-disc pl-5 space-y-2'><li>핵심 MVP 프로덕트 외주 개발 및 클라우드 서버 인프라 구축 (600만 원)</li><li>초기 시드 유저(기술자 500명, 기업 20개사) 획득을 위한 프로모션 및 B2B 콜드콜 영업 비용 (300만 원)</li><li>법률 검토 (근로기준법, 직업안정법 관련 규제 리스크 검토) (100만 원)</li></ul>"),
    ("North Star Metric (북극성 지표)", "<div class='bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg'><p class='font-bold text-indigo-900 mb-0'>검증 완료된 활성 프로필(Verified Profile) 수 300개 달성</p><p class='text-sm text-indigo-700 mt-1'>가입자 수가 아닌, 실제로 경력과 자격증이 기입되어 기업이 '열람할 가치'가 있는 데이터의 축적 속도를 핵심 지표로 삼습니다.</p></div>")
]

# Round 3
r3_sections = [
    ("핵심 목표: 비즈니스 스케일업 및 투자 유치", "<p>2라운드에서 검증된 PMF(Product-Market Fit)를 바탕으로, 실제 <strong>매출을 창출할 수 있는 수익 모델(BM)</strong>이 작동함을 증명하고 전국 단위로 확장할 수 있는 스케일업 전략을 전문 투자사(VC)에게 피칭합니다.</p>"),
    ("PoC (Proof of Concept) 실증 사례 확보", "<p>단순 테스트를 넘어, 실제 중견 건설사 또는 대형 전문건설업체 2~3곳과 <strong>MOU 및 PoC 실증 계약을 체결</strong>합니다. 현장의 채용 리드타임을 얼마나 줄이고, 불량 인력 리스크를 얼마나 감소시켰는지 정량적 ROI 리포트를 도출합니다.</p>"),
    ("수익 모델 (Monetization) 검증", "<ul class='list-disc pl-5 space-y-2'><li><strong>B2B SaaS 구독 (MONO Operations):</strong> 현장 운영자 및 건설사가 인력 데이터를 관리하고 출역 일보를 자동화하는 클라우드 소프트웨어 구독료.</li><li><strong>프리미엄 채용 매칭:</strong> 기업이 급하게 고숙련/특정 자격증 보유자를 찾을 때 사용하는 프리미엄 서치 및 열람 수수료.</li></ul>"),
    ("향후 로드맵 (차년도 연계)", "<div class='bg-warm-50 border-l-4 border-warm-500 p-4 rounded-r-lg'><p class='font-bold text-ink-900 mb-0'>TIPS(민간투자주도형 기술창업지원) 프로그램 연계</p><p class='text-sm text-ink-700 mt-1'>본 오디션을 통해 확보한 시드 투자사(SI/FI)와 함께 내년도 TIPS 트랙에 진출, R&D 자금(최대 5억~7억)을 확보하여 AI 매칭 알고리즘과 결제/정산 시스템(MONO Pay)을 고도화합니다.</p></div>")
]

r1_modal = generate_modal("r1-strategy-modal", "ROUND 1", "1라운드 준비 전략 (서류 및 발표)", r1_sections)
r2_modal = generate_modal("r2-strategy-modal", "ROUND 2", "2라운드 준비 전략 (지역 오디션)", r2_sections)
r3_modal = generate_modal("r3-strategy-modal", "ROUND 3", "3라운드 준비 전략 (권역 오디션)", r3_sections)


# Replace existing modals
# Using regex to find and replace the entire <dialog>...</dialog> block for each modal

def replace_dialog(html_content, dialog_id, new_dialog):
    pattern = r'<dialog[^>]*id="' + dialog_id + r'"[^>]*>.*?<\/dialog>'
    return re.sub(pattern, new_dialog, html_content, flags=re.DOTALL)

html = replace_dialog(html, 'r1-strategy-modal', r1_modal)
html = replace_dialog(html, 'r2-strategy-modal', r2_modal)
html = replace_dialog(html, 'r3-strategy-modal', r3_modal)

with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Modals updated successfully.")
