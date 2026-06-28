import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Section 1
    content = content.replace(
        '<h2 class="h-display hero-title text-ink-900 strategy-title w-full">MONO는 기술자의 경험, 기업의 현장 수요, 장비·자재·출역 운영 데이터를 하나의 신뢰 데이터 인프라로 연결합니다.</h2>',
        '<h2 class="h-display hero-title text-ink-900 strategy-title w-full">기술자의 경험과 기업의 현장 수요를 신뢰 데이터로 연결하는 MONO</h2>'
    )
    
    # We must replace the paragraph under it
    content = re.sub(
        r'<p class="body-lg mt-5 font-semibold text-ink-900".*?>\s*MONO는 기술자가 필요한 산업 현장에서 사람.*?플랫폼입니다\.\s*</p>',
        '<p class="text-lg md:text-xl text-ink-500 max-w-4xl font-medium leading-relaxed mb-6">MONO는 기술자의 경험, 기업의 채용 수요, 현장 운영 데이터를 하나의 신뢰 데이터 흐름으로 연결하는 산업 신뢰 인프라 플랫폼입니다.</p>\n<p class="text-lg md:text-xl text-ink-500 max-w-4xl font-medium leading-relaxed">기술자는 경력과 자격을 신뢰 프로필로 축적하고, 기업은 검증 가능한 기술자·현장 리더·팀을 찾으며, 현장 운영 데이터는 채용·장비·자재·교육·금융 기회로 확장됩니다.</p>',
        content, flags=re.DOTALL
    )
    # also remove the hidden md:block and block md:hidden ones if any? Wait, user said "본문은 2~3문장으로 축소".
    content = re.sub(
        r'<p class="hidden md:block body-md mt-3".*?>.*?</p>', '', content, flags=re.DOTALL
    )
    content = re.sub(
        r'<div class="block md:hidden mt-5 bg-warm-100/50.*?</div>', '', content, flags=re.DOTALL
    )

    # 왜 이 구조가 중요한가
    content = re.sub(
        r'<div class="eyebrow">왜 이 구조가 중요한가</div>\s*<h3.*?>.*?</h3>\s*<p.*?>.*?</p>',
        '<div class="eyebrow">왜 이 구조가 중요한가</div>\n<h3 class="font-bold text-ink-900">산업 현장의 문제는 사람, 기업, 장비와 운영 데이터가 분리되어 있다는 점입니다.</h3>\n<p class="text-ink-700 mt-2">MONO는 공고 등록, 프로필 작성, 팀 구성, 현장 투입, 운영과 평가를 하나의 흐름으로 연결해 반복 가능한 신뢰 데이터를 만듭니다.</p>',
        content, flags=re.DOTALL
    )

    # Cards
    content = re.sub(
        r'(<h3 class="font-bold text-ink-900 mb-2">MONO Profile</h3>\s*)<p class="body-md text-ink-700 leading-relaxed">.*?</p>',
        r'\1<p class="body-md text-ink-700 leading-relaxed">기술자의 경력, 자격, 안전교육, 현장 경험과 장비 사용 이력을 신뢰 프로필로 축적합니다.<br>프로필은 채용, 교육, 금융, 보험과 글로벌 이동 기회로 확장됩니다.</p>',
        content, flags=re.DOTALL
    )
    content = re.sub(
        r'(<h3 class="font-bold text-ink-900 mb-2">MONO Partner Workspace</h3>\s*)<p class="body-md text-ink-700 leading-relaxed">.*?</p>',
        r'\1<p class="body-md text-ink-700 leading-relaxed">기업이 채용 공고, 현장 작업 요청, 기술자 검토, 팀 구성과 협력사 운영을 관리하는 기업용 업무공간입니다.</p>',
        content, flags=re.DOTALL
    )
    content = re.sub(
        r'(<h3 class="font-bold text-ink-900 mb-2">MONO Field Operations</h3>\s*)<p class="body-md text-ink-700 leading-relaxed">.*?</p>',
        r'\1<p class="body-md text-ink-700 leading-relaxed">공구·장비·소모자재·출역·근무환경·교육 수요를 연결해 현장 운영 데이터를 축적하는 확장 BM입니다.</p>',
        content, flags=re.DOTALL
    )

    # Section 02 problem
    content = re.sub(
        r'(<section.*?id="problem".*?>\s*<div class="strategy-container">\s*<div class="section-header reveal">\s*<div class="section-label mb-6"><span class="num">02</span>.*?</div>\s*)<h2.*?>.*?</h2>\s*<div.*?>\s*<p.*?>.*?</p>\s*<p.*?>.*?</p>\s*<p.*?>.*?</p>\s*</div>',
        r'\1<h2 class="h-display hero-title text-ink-900 strategy-title w-full">일자리는 쉽게 찾고, 기업은 현장 수요를 쉽게 등록하는 상생 데이터 인프라</h2>\n<div class="mt-5 space-y-4 max-w-4xl">\n<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed">MONO는 기술자가 일자리와 경력을 쌓고, 기업이 필요한 기술 인력과 현장 운영 데이터를 관리하도록 돕습니다.</p>\n<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed">채용 공고, 현장 작업 요청, 출역, 장비·자재, 교육과 평가 데이터는 하나의 신뢰 인프라로 축적됩니다.</p>\n<p class="text-lg md:text-xl text-ink-500 font-medium leading-relaxed">이 데이터는 대기업 상생, 외국인 기술인력 관리, 포용금융과 미래 현장 기술로 확장됩니다.</p>\n</div>',
        content, flags=re.DOTALL
    )

    # Section 03 startup
    content = re.sub(
        r'(<section.*?id="startup".*?>\s*<div class="strategy-container">\s*<div class="section-header reveal">\s*<div class="section-label mb-6"><span class="num">03</span>.*?</div>\s*<h2.*?>.*?</h2>\s*)<p.*?>.*?</p>',
        r'\1<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl">MONO의 초기 검증은 불특정 사용자를 모으는 방식보다, 원청 또는 중견 원청의 특정 현장을 Anchor PoC로 확보하는 방식으로 진행합니다.<br>현장에서는 복잡한 SaaS보다 공구·장비 요청, 소모자재 반복 발주, 출역 명단과 안전교육 확인처럼 바로 필요한 업무부터 해결합니다.</p>',
        content, flags=re.DOTALL
    )

    # Section 05 bm
    content = re.sub(
        r'(<section.*?id="bm".*?>\s*<div class="strategy-container">\s*<div class="section-header reveal">\s*<div class="section-label mb-6"><span class="num">05</span>.*?</div>\s*<h2.*?>.*?</h2>\s*)<p.*?>.*?</p>',
        r'\1<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl">MONO의 수익모델은 기업의 반복 사용에서 시작합니다.<br>기업은 공고 등록, 기술자·팀 검토, 협력사 운영을 위해 Workspace를 사용하고, MONO는 채용·팀 매칭, 현장 운영 거래, 금융·보험·교육 제휴로 수익을 확장합니다.</p>',
        content, flags=re.DOTALL
    )

    # Section 06 lifecycle
    content = re.sub(
        r'<div class="text-sm font-semibold tracking-wider text-tech-600 mb-4">06 MONO 브랜드 철학</div>',
        '<div class="text-sm font-semibold tracking-wider text-tech-600 mb-4">06 MONO와 함께 만들어가는 순간들</div>',
        content
    )
    content = re.sub(
        r'(<section.*?id="lifecycle".*?>.*?<h2.*?>.*?</h2>\s*)<p.*?>.*?</p>',
        r'\1<p class="text-ink-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">MONO는 기술자의 경험이 단기 일거리로 사라지지 않고, 더 좋은 일자리, 안전한 근무환경, 포용금융, 보험, 교육과 미래 기술 기회로 이어지는 구조를 만듭니다.</p>',
        content, flags=re.DOTALL
    )
    tabs = {
        '입문': '첫 기술을 배우는 순간',
        '성장': '내 손으로 기회를 만드는 순간',
        '안정': '경력이 신뢰가 되는 순간',
        '확장': '더 큰 현장으로 이동하는 순간',
        '은퇴 이후': '삶을 다시 설계하는 순간',
        '자산화': '경험이 금융·교육·미래 기회가 되는 순간'
    }
    for old, new in tabs.items():
        content = re.sub(
            fr'(<button.*?id="tab-btn-\d+".*?>.*?<span class="font-bold relative z-10">){old}(</span>.*?</button>)',
            fr'\g<1>{new}\g<2>',
            content, flags=re.DOTALL
        )

    # Section 07 vision
    content = re.sub(
        r'(<section.*?id="vision".*?>\s*<div class="strategy-container">\s*<div class="section-header reveal text-center max-w-4xl mx-auto">\s*<div class="section-label mb-6 justify-center"><span class="num">07</span>.*?</div>\s*<h2.*?>.*?</h2>\s*)<p.*?>.*?</p>',
        r'\1<p class="body-lg mt-5 font-semibold text-ink-900 max-w-4xl mx-auto">MONO가 축적하는 현장 데이터는 장기적으로 Tech-Blue 기술 인프라로 확장됩니다.<br>기술자 경험, 현장 운영, 장비·자재, 안전·교육 데이터는 미래의 AI 현장 운영체제와 AGI Core OS를 위한 산업 데이터 기반이 됩니다.</p>',
        content, flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updating files using regex...")
files = [
    '/Users/yunhyeok/mono/web/public/strategy.html',
    '/Users/yunhyeok/mono/live_strategy.html',
    '/Users/yunhyeok/mono/test.html'
]
for f in files:
    try:
        update_file(f)
        print(f"Updated {f}")
    except Exception as e:
        print(f"Failed {f}: {e}")
