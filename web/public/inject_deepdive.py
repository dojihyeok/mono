# -*- coding: utf-8 -*-
import re

with open('web/public/strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Section Numbers
html = html.replace('<span class="num">06</span> MONO와 함께 만들어가는 순간들', '<span class="num">07</span> MONO 브랜드 철학')
html = html.replace('<!-- ============================== 06. MONO와 함께 만들어가는 순간들 ============================== -->', '<!-- ============================== 07. MONO 브랜드 철학 ============================== -->')

html = html.replace('<span class="num">07</span> Next MONO', '<span class="num">08</span> Next MONO')
html = html.replace('<!-- ============================== 07. Next MONO ============================== -->', '<!-- ============================== 08. Next MONO ============================== -->')

# 2. Prepare Deep Dive HTML
deep_dive_html = """
<!-- ============================== 06. Deep Dive · 상세 분석 ============================== -->
<section class="py-20 md:py-32 bg-warm-100 relative overflow-hidden" id="deep-dive">
  <div class="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
    <div class="section-label mb-6"><span class="num">06</span> Deep Dive · 상세 분석</div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
      <div class="lg:col-span-12">
        <h2 class="text-3xl md:text-5xl font-black text-ink-900 tracking-tight leading-tight mb-6">
          MONO의 핵심 전략 상세
        </h2>
        <p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed mb-12">
          경쟁사 분석, 기업가치 시뮬레이션, 장기 기술 비전 등 핵심적인 인사이트를 모달에서 확인하세요.
        </p>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
"""

items = [
    {"id": "competitor", "title": "경쟁사 분석", "summary": "국내외 유사 솔루션 대비 MONO의 데이터 구조 차별성", "cat": "Market"},
    {"id": "valuation", "title": "기업가치 시뮬레이션", "summary": "한국 평균 기준 성장 단계별 기업가치 가정", "cat": "Investment"},
    {"id": "mono-gear", "title": "MONO Gear 상세", "summary": "공구·장비 쉐어 네트워크 BM과 리스크", "cat": "Business Model"},
    {"id": "round2", "title": "2라운드 검증 지표", "summary": "핵심 성장 지표, Aha Moment, Retention", "cat": "Validation"},
    {"id": "regulation", "title": "규제 리스크 상세", "summary": "직업소개, 파견, 정산, 보험, 중장비 검토", "cat": "Risk"},
    {"id": "agi", "title": "장기 기술 비전", "summary": "Tech-Blue 데이터에서 AGI Core OS Device로 확장", "cat": "Future"},
    {"id": "investment", "title": "투자 유치 전략", "summary": "VC, 금융권 SI, 산업계 SI, 공공 협력 전략", "cat": "IR"},
]

for idx, item in enumerate(items):
    deep_dive_html += f"""
          <div class="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm hover:shadow-neo-hover transition-all cursor-pointer flex flex-col" onclick="document.getElementById('modal-{item['id']}').showModal()">
            <div class="text-xs font-bold text-tech-600 uppercase tracking-widest mb-3">{item['cat']}</div>
            <h3 class="text-xl font-bold text-ink-900 mb-2">{item['title']}</h3>
            <p class="text-sm text-ink-500 mb-6 flex-grow">{item['summary']}</p>
            <button class="w-full py-2.5 bg-warm-50 text-ink-700 font-bold text-sm rounded-lg hover:bg-tech-50 hover:text-tech-700 transition-colors">
              상세 보기
            </button>
          </div>
"""

deep_dive_html += """
        </div>
      </div>
    </div>
  </div>
</section>
"""

# Modals
modals_html = """
<!-- ============================== DEEP DIVE MODALS ============================== -->
"""

modals_content = {
    "competitor": "<p>비교군: 커리어 네트워크(LinkedIn) / 현장 SaaS(Procore, ServiceTitan) / 산업 인력 플랫폼(Workrise) / 국내 인력(가다) / 장비 렌탈(일반 렌탈사) → <strong>MONO</strong>.</p><p class='mt-4'>MONO의 핵심 경쟁력은 단순한 기능의 나열이 아닌, 현장에서 발생하는 방대한 행동 데이터와 작업 이력을 구조화하는 방식에 있습니다.</p><div class='mt-6 bg-safety-yellow/10 border-l-4 border-safety-tape p-4 rounded-r-lg'><p class='text-sm font-bold text-safety-rust mb-0'>MONO의 차별성은 기능 수가 아니라 데이터 구조에 있습니다.</p></div>",
    "valuation": "<p>한국 스타트업 평균 기준에 맞춘 성장 단계별 예상 기업가치입니다. 이는 사업 전략 및 IR을 위한 내부 시뮬레이션 데이터입니다.</p><div class='overflow-x-auto mt-6'><table class='w-full text-left border-collapse'><thead class='bg-warm-50'><tr><th class='p-3 font-bold text-ink-700 border-b border-warm-200'>단계</th><th class='p-3 font-bold text-ink-700 border-b border-warm-200'>주요 조건</th><th class='p-3 font-bold text-ink-700 border-b border-warm-200'>예상 기업가치</th></tr></thead><tbody><tr><td class='p-3 border-b border-warm-100'>MVP / 2R</td><td class='p-3 border-b border-warm-100'>기술자·기업 수요 검증</td><td class='p-3 border-b border-warm-100'>10억~30억</td></tr><tr><td class='p-3 border-b border-warm-100'>Seed</td><td class='p-3 border-b border-warm-100'>MVP, 인터뷰, PoC 후보</td><td class='p-3 border-b border-warm-100'>50억~120억</td></tr><tr><td class='p-3 border-b border-warm-100'>Pre-A</td><td class='p-3 border-b border-warm-100'>유료 PoC, 초기 ARR</td><td class='p-3 border-b border-warm-100'>100억~250억</td></tr><tr><td class='p-3 border-b border-warm-100'>Series A</td><td class='p-3 border-b border-warm-100'>B2B SaaS 매출 검증</td><td class='p-3 border-b border-warm-100'>200억~600억</td></tr><tr><td class='p-3 border-b border-warm-100'>Series B</td><td class='p-3 border-b border-warm-100'>전국 확장, SI 논의</td><td class='p-3 border-b border-warm-100'>700억~2,000억</td></tr><tr><td class='p-3 border-b border-warm-100'>Series C</td><td class='p-3 border-b border-warm-100'>산업 인프라 플랫폼화</td><td class='p-3 border-b border-warm-100'>2,000억~5,000억</td></tr><tr><td class='p-3'>상방</td><td class='p-3'>대기업/금융권 SI, 공공 실증</td><td class='p-3'>5,000억~1조+</td></tr></tbody></table></div><div class='mt-6 bg-safety-yellow/10 border-l-4 border-safety-tape p-4 rounded-r-lg'><p class='text-sm font-bold text-safety-rust mb-0'>주의: 투자 검토용 가정이며 실제 가치는 매출·성장률·유지율·시장상황·SI·규제대응에 따라 달라집니다.</p></div>",
    "mono-gear": "<p>가정용/전문 시공 공구·기업용 장비·중장비를 적시에 연결합니다. 기술자의 직군, 경력, 자격 및 안전교육 이력을 기반으로 최적화된 매칭을 제공합니다.</p><p class='mt-4'><strong>주요 수익원:</strong> 공구 대여, 전문 장비 렌탈, 기업 장비 구독, 중장비 연결, 장비+기술자 패키지, 보험·보증, 정비·점검, 장비 금융.</p><p class='mt-4'><strong>리스크 대응:</strong> 파손, 분실, 안전사고 및 중장비 규제, 물류·회수 문제에 대비해 보증금, 전용 보험, 철저한 자격 확인, 패키지 운영 및 거점화 전략으로 대응합니다.</p>",
    "round2": "<p>제품의 초기 시장 검증(MVP 2라운드)을 위해 설정한 핵심 성장 및 사용자 행동 지표 목표입니다.</p><ul class='list-disc pl-5 mt-4 space-y-2'><li>기술자 인터뷰 50명+</li><li>기업 인터뷰 20~30개사</li><li>기본 프로필 완성률 40%+</li><li>경력 1건 등록 30%+ / 경력 3건 등록 15%+</li><li>공유율 10%+</li><li>7일 재방문율 15~25%</li><li>기업 관심저장 조회 20%+</li><li>장비 관심 클릭 5~15%</li><li>PoC 관심 3~5개사</li></ul><div class='mt-6 bg-safety-yellow/10 border-l-4 border-safety-tape p-4 rounded-r-lg'><p class='text-sm font-bold text-safety-rust mb-0'>초기 목표는 단순 가입자 수 경쟁이 아니라 실제 행동 데이터 확보에 있습니다.</p></div>",
    "regulation": "<p>MONO 비즈니스 모델이 성장함에 따라 직면할 수 있는 주요 규제 리스크와 단계별 대응 전략입니다.</p><ul class='list-disc pl-5 mt-4 space-y-2'><li><strong>직업소개사업 / 근로자파견:</strong> 적법한 라이선스 등록 및 파트너 제휴를 통한 합법적 인력 연결.</li><li><strong>정산·에스크로 / 보험:</strong> 금융당국 가이드라인 준수 및 구조 분리, 전문 보험사 자문.</li><li><strong>중장비 / 외국인 근로자:</strong> 관련 법령(외국인고용법 등) 준수, 동의 및 감사 로그 철저 관리.</li><li><strong>개인정보:</strong> 민감 정보 접근 제어 및 암호화.</li></ul><div class='mt-6 bg-safety-yellow/10 border-l-4 border-safety-tape p-4 rounded-r-lg'><p class='text-sm font-bold text-safety-rust mb-0'>초기 MVP 단계에서는 법적 문제가 발생하지 않는 수요 검증 범위 내에서만 운영됩니다.</p></div>",
    "agi": "<p>MONO가 궁극적으로 바라보는 장기 기술 비전입니다. 현장의 모든 데이터를 융합하여 새로운 패러다임을 제시합니다.</p><p class='mt-4'><strong>데이터 입력:</strong> 센서, 작업기록, 경력, 장비이력, 안전 데이터의 종합 수집.</p><p class='mt-4'><strong>진화 방향:</strong> 축적된 Tech-Blue 데이터를 기반으로 <strong>AGI Core OS Device</strong>로 나아갑니다. 이는 휴먼 로봇, 중장비 자율주행, 스마트 공구, 3D 프린터 등과 연결되는 산업 현장의 핵심 운영 체제가 될 것입니다.</p><div class='mt-6 bg-safety-yellow/10 border-l-4 border-safety-tape p-4 rounded-r-lg'><p class='text-sm font-bold text-safety-rust mb-0'>이 비전은 현재 MVP의 범위를 넘어선 장기 비전으로, 별도의 전략 트랙으로 관리됩니다.</p></div>",
    "investment": "<p>MONO의 성장을 가속화하기 위한 전략적 투자 유치 및 파트너십 구축 계획입니다.</p><ul class='list-disc pl-5 mt-4 space-y-2'><li><strong>VC (Venture Capital):</strong> 스케일업 자금 확보 및 재무적 조력.</li><li><strong>금융권 SI:</strong> 에스크로, 현장 정산, 장비 금융 관련 전략적 제휴.</li><li><strong>산업계 SI:</strong> 대형 건설사, 플랜트, 중장비 제조사와의 실증(PoC) 및 파이프라인 구축.</li><li><strong>공공·정책 자금 / 전략적 엔젤:</strong> 정부 R&amp;D 지원금 확보 및 산업 전문가의 초기 투자 유치.</li></ul>"
}

for item in items:
    id_ = item['id']
    title = item['title']
    cat = item['cat']
    content = modals_content[id_]
    modals_html += f"""
<dialog class="bg-transparent w-full h-full p-0 m-0 fixed inset-0 z-[100] backdrop:bg-ink-900/50" id="modal-{id_}">
  <div class="fixed inset-0 bg-ink-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto" onclick="document.getElementById('modal-{id_}').close()">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-neo-hover overflow-hidden relative flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
      <div class="p-6 md:p-8 border-b border-warm-200 flex justify-between items-start bg-white sticky top-0 z-10">
        <div>
          <div class="text-xs font-bold text-tech-600 uppercase tracking-widest mb-2">{cat}</div>
          <h2 class="text-2xl md:text-3xl font-bold text-ink-900">{title}</h2>
        </div>
        <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-warm-100 text-ink-400 hover:text-ink-900 transition-colors" onclick="document.getElementById('modal-{id_}').close()">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="p-6 md:p-8 overflow-y-auto text-ink-700 leading-relaxed">
        {content}
      </div>
    </div>
  </div>
</dialog>
"""

# Insert Section 06 before Section 07
target_str = '<!-- ============================== 07. MONO 브랜드 철학 ============================== -->'
parts = html.split(target_str)
if len(parts) == 2:
    new_html = parts[0] + deep_dive_html + target_str + parts[1]
    
    # Insert modals before </body>
    new_html = new_html.replace('</body>', modals_html + '\n</body>')
    
    with open('web/public/strategy.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Injected successfully.")
else:
    print("Target string not found for injection.")

