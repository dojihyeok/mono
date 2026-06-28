import re

with open('live_strategy.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix Section 01
html = re.sub(
    r'(<div class="section-label mb-6"><span class="num">01</span> MONO 서비스 소개 · 스마트 현장 플랫폼</div>\s*)<h2 class="h-display hero-title text-ink-900 strategy-title[^>]*>기술자는 더 좋은 현장을 찾고, 기업은 믿을 수 있는 사람과 팀을 찾습니다</h2>\s*<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed mb-6 break-keep[^>]*>MONO는 기술자와 기업을 연결하는 스마트 현장 플랫폼입니다.*?<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed mb-6 break-keep[^>]*>초기에는.*?<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep[^>]*>MONO Field Operations는.*?</p>',
    r'''\1<div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
<div class="lg:col-span-5">
<h2 class="h-display hero-title text-ink-900 strategy-title w-full">기술자는 더 좋은 현장을 찾고,<br class="hidden lg:block"/>기업은 믿을 수 있는 사람과 팀을 찾습니다</h2>
</div>
<div class="lg:col-span-7 space-y-6">
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">MONO는 기술자와 기업을 연결하는 스마트 현장 플랫폼입니다. 기술자는 자신의 경력, 자격, 안전교육, 현장 경험을 MONO Profile에 쌓아 더 좋은 일자리와 기회를 찾을 수 있습니다. 기업과 수행사는 Partner Workspace에서 채용 공고와 현장 작업 요청을 등록하고, 검증 가능한 기술자·현장 리더·팀을 확인할 수 있습니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">초기에는 건설·인테리어 현장에서 시작하고, 이후 조선, 플랜트, 제조 설비, 물류, 에너지, 항만·공항, 공공 인프라, 재난복구, 우주·로봇 산업까지 확장합니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">MONO Field Operations는 현장에서 필요한 공구, 장비, 소모자재, 근무환경, 교육 수요를 함께 연결합니다. 이 과정에서 기술자의 경험과 기업의 현장 운영 데이터가 쌓이고, MONO는 이를 기반으로 더 안전하고 효율적인 산업 현장을 만듭니다.</p>
</div>
</div>''',
    html, flags=re.DOTALL
)

# Fix Section 02
html = re.sub(
    r'(<div class="section-label"><span class="num">02</span> MONO VISION &amp; 상생 데이터 인프라</div>\s*)<h2 class="h-display text-ink-900 leading-\[1.2\] md:leading-tight tracking-tight strategy-title w-full">일자리는 쉽게 찾고, 기업은 현장 수요를 쉽게 등록하는 상생 데이터 인프라</h2>\s*<div class="max-w-4xl text-left break-keep  text-ink-800 leading-relaxed strategy-body space-y-4">\s*<p[^>]*>MONO는 기술자가 일자리와 경력을 쌓고, 기업이 필요한 기술 인력과 현장 운영 데이터를 관리하도록 돕습니다.</p><p[^>]*>채용 공고, 현장 작업 요청, 출역, 장비·자재, 교육과 평가 데이터는 하나의 신뢰 인프라로 축적됩니다.</p><p[^>]*>이 데이터는 대기업 상생, 외국인 기술인력 관리, 포용금융과 미래 현장 기술로 확장됩니다.</p>\s*</div>',
    r'''\1<div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full mt-4">
<div class="lg:col-span-5">
<h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight strategy-title w-full">일자리는 쉽게 찾고,<br class="hidden lg:block"/>기업은 현장 수요를 쉽게 등록하는 상생 데이터 인프라</h2>
</div>
<div class="lg:col-span-7 space-y-4">
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">MONO는 기술자가 일자리와 경력을 쌓고, 기업이 필요한 기술 인력과 현장 운영 데이터를 관리하도록 돕습니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">채용 공고, 현장 작업 요청, 출역, 장비·자재, 교육과 평가 데이터는 하나의 신뢰 인프라로 축적됩니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">이 데이터는 대기업 상생, 외국인 기술인력 관리, 포용금융과 미래 현장 기술로 확장됩니다.</p>
</div>
</div>''',
    html, flags=re.DOTALL
)

# Fix Section 03
html = re.sub(
    r'(<div class="section-label mb-6"><span class="num">03</span> 모두의 창업 오디션 전략</div>\s*)<h2 class="h-display text-ink-900 leading-\[1.2\] md:leading-tight tracking-tight strategy-title">모두의 창업 1라운드부터 우승까지, 단계별 통과 전략</h2>\s*<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl">MONO의 초기 검증은 불특정 사용자를 모으는 방식보다, 원청 또는 중견 원청의 특정 현장을 Anchor PoC로 확보하는 방식으로 진행합니다.<br>현장에서는 복잡한 SaaS보다 공구·장비 요청, 소모자재 반복 발주, 출역 명단과 안전교육 확인처럼 바로 필요한 업무부터 해결합니다.</p>',
    r'''\1<div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
<div class="lg:col-span-5">
<h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight strategy-title">모두의 창업 1라운드부터 우승까지,<br class="hidden lg:block"/>단계별 통과 전략</h2>
</div>
<div class="lg:col-span-7 space-y-4">
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">MONO의 초기 검증은 불특정 사용자를 모으는 방식보다, 원청 또는 중견 원청의 특정 현장을 Anchor PoC로 확보하는 방식으로 진행합니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">현장에서는 복잡한 SaaS보다 공구·장비 요청, 소모자재 반복 발주, 출역 명단과 안전교육 확인처럼 바로 필요한 업무부터 해결합니다.</p>
</div>
</div>''',
    html, flags=re.DOTALL
)

# Fix Section 04
html = re.sub(
    r'(<div class="section-label mb-6"><span class="num">04</span> 장기 진화 로드맵</div>\s*)<h2 class="h-display text-ink-900 leading-\[1.2\] md:leading-tight tracking-tight strategy-title">산업 신뢰 인프라로 진화하는 5단계 성장 로드맵</h2>\s*<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl">초기 현장 운영 솔루션\(SaaS\)에서 시작하여, 기술자 평판 프로필\(B2C\), 현장 특화 커머스, 금융·보험을 거쳐 궁극적으로 미래 산업 기술을 연결하는 Tech-Blue 인프라로 진화합니다.</p>',
    r'''\1<div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
<div class="lg:col-span-5">
<h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight strategy-title">산업 신뢰 인프라로 진화하는<br class="hidden lg:block"/>5단계 성장 로드맵</h2>
</div>
<div class="lg:col-span-7">
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">초기 현장 운영 솔루션(SaaS)에서 시작하여, 기술자 평판 프로필(B2C), 현장 특화 커머스, 금융·보험을 거쳐 궁극적으로 미래 산업 기술을 연결하는 Tech-Blue 인프라로 진화합니다.</p>
</div>
</div>''',
    html, flags=re.DOTALL
)

# Fix Section 05
html = re.sub(
    r'(<div class="section-label mb-6"><span class="num">05</span> MONO 비즈니스 모델</div>\s*)<h2 class="h-display text-ink-900 leading-\[1.2\] md:leading-tight tracking-tight strategy-title">기술자의 경험이 신뢰 데이터가 되는 비즈니스 모델</h2>\s*<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl">MONO의 수익모델은 기업의 반복 사용에서 시작합니다.<br>기업은 공고 등록, 기술자·팀 검토, 협력사 운영을 위해 Workspace를 사용하고, MONO는 채용·팀 매칭, 현장 운영 거래, 금융·보험·교육 제휴로 수익을 확장합니다.</p>',
    r'''\1<div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
<div class="lg:col-span-5">
<h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight strategy-title">기술자의 경험이 신뢰 데이터가 되는<br class="hidden lg:block"/>비즈니스 모델</h2>
</div>
<div class="lg:col-span-7 space-y-4">
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">MONO의 수익모델은 기업의 반복 사용에서 시작합니다.</p>
<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed break-keep text-justify">기업은 공고 등록, 기술자·팀 검토, 협력사 운영을 위해 Workspace를 사용하고, MONO는 채용·팀 매칭, 현장 운영 거래, 금융·보험·교육 제휴로 수익을 확장합니다.</p>
</div>
</div>''',
    html, flags=re.DOTALL
)

with open('live_strategy.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated all sections to 2-column layout!")
