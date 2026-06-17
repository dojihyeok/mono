import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update S4 Step 6 content
old_step6 = """<h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">글로벌 확장</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold">해외 일자리 연결, 비자 지원 정보 제공, 해외 정착 지원, 글로벌 경력 관리 연동.</p>"""

new_step6 = """<h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">글로벌 파이프라인 (외국인 생애주기)</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold mb-3">입국 지원을 넘어 외국인 기술자의 전체 생애주기를 관리하여 구조적 인력난을 해결합니다.</p>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>1. 해외 모집 네트워크:</strong> 현지 직업훈련기관 파트너십 구축 및 입국 전 사전 교육</li>
              <li><strong>2. 사전 검증:</strong> 비디오 인터뷰, 기술 테스트 기반 디지털 프로필 등록 및 등급 부여</li>
              <li><strong>3. 현지 적응:</strong> 입국 직후 맞춤형 안전/문화 교육, 행정 지원 및 파트너사 매칭</li>
              <li><strong>4. 장기 체류 비전:</strong> 근무 이력 데이터 자산화로 E-7 비자 전환 등 코리안 드림의 로드맵 제공</li>
            </ul>"""
html = html.replace(old_step6, new_step6)

# 2. Update S5 BM content
old_bm = """<h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-globe text-tech-500"></i> 외국인 기술자 통합 지원</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">E-7-4, E-9 대상 채용 수수료, 비자/정착/통역 지원. 국내 인력난 구조적 해결의 핵심</p>"""

new_bm = """<h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-globe text-tech-500"></i> 외국인 기술자 생애주기 플랫폼</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">입국 전 검증부터 현지 적응, E-7-4/E-9 비자 지원 및 채용 매칭 수수료. 파편화된 외국인 인력 시장을 통합하는 핵심 BM</p>"""
html = html.replace(old_bm, new_bm)

# 3. Delete Section 06
# Using regex to find <section id="global-pipeline"> to the next </section>
s6_pattern = re.compile(r'<!-- ============================== S6 · GLOBAL ============================== -->\s*<section id="global-pipeline".*?</section>', re.DOTALL)
html = s6_pattern.sub('', html)

# 4. Update Navigation
# Remove global-pipeline link from desktop and mobile nav
html = re.sub(r'<a class="nav-link" href="#global-pipeline">.*?</a>\s*', '', html)
html = re.sub(r'<a class="mob-nav-link.*?href="#global-pipeline">.*?</a>\s*', '', html)

# 5. Update Section Numbers
html = html.replace('<div class="section-label mb-4"><span class="num">07</span> MONO 브랜드 철학 · 스마트 일자리 플랫폼</div>', '<div class="section-label mb-4"><span class="num">06</span> MONO 브랜드 철학 · 스마트 일자리 플랫폼</div>')
html = html.replace('<div class="section-label mb-4"><span class="num">08</span> Next MONO = Tech-Blue</div>', '<div class="section-label mb-4"><span class="num">07</span> Next MONO = Tech-Blue</div>')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section merged and updated.")
