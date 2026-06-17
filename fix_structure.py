import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('/tmp/startup_section.html', 'r', encoding='utf-8') as f:
    startup_html = f.read()

# 1. Update Navigation
# Desktop Nav
old_nav = """    <nav class="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-ink-700">
      <a class="nav-link" href="#platform">서비스소개</a>
      <a class="nav-link" href="#problem">해결과제</a>
      <a class="nav-link" href="#gtm">모두의창업 GTM 전략</a>
      <a class="nav-link" href="#invest">MONO 성장 전략</a>
      <a class="nav-link" href="#lifecycle">MONO 브랜드 철학</a>
      <a class="nav-link" href="#vision">Next MONO</a>
    </nav>"""
new_nav = """    <nav class="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-ink-700">
      <a class="nav-link" href="#platform">서비스소개</a>
      <a class="nav-link" href="#problem">해결과제</a>
      <a class="nav-link" href="#startup">모두의 창업 준비 전략</a>
      <a class="nav-link" href="#gtm">MONO 성장 전략</a>
      <a class="nav-link" href="#bm">비즈니스 모델</a>
      <a class="nav-link" href="#global-pipeline">글로벌 인재</a>
      <a class="nav-link" href="#lifecycle">브랜드 철학</a>
    </nav>"""
html = html.replace(old_nav, new_nav)

# Mobile Nav
old_mob_nav = """        <nav class="flex flex-col gap-4 text-[15px] font-semibold text-ink-700">
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#platform">서비스소개</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#problem">해결과제</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#gtm">모두의창업 GTM 전략</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#invest">MONO 성장 전략</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#lifecycle">MONO 브랜드 철학</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#vision">Next MONO</a>
        </nav>"""
new_mob_nav = """        <nav class="flex flex-col gap-4 text-[15px] font-semibold text-ink-700">
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#platform">서비스소개</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#problem">해결과제</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#startup">모두의 창업 준비 전략</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#gtm">MONO 성장 전략</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#bm">비즈니스 모델</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#global-pipeline">글로벌 인재</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#lifecycle">브랜드 철학</a>
          <a class="mob-nav-link py-1 hover:text-ink-900 transition-colors" href="#vision">Next MONO</a>
        </nav>"""
html = html.replace(old_mob_nav, new_mob_nav)

# 2. Numbering Updates
html = html.replace('<div class="section-label mb-4"><span class="num">03</span> MONO 단계별 성장 전략</div>', '<div class="section-label mb-4"><span class="num">04</span> MONO 단계별 성장 전략 (GTM)</div>')
html = html.replace('<div class="section-label mb-4"><span class="num">04</span> MONO 비즈니스 모델 · Business Model</div>', '<div class="section-label mb-4"><span class="num">05</span> MONO 비즈니스 모델 · Business Model</div>')
html = html.replace('<div class="section-label mb-4"><span class="num">05</span> 글로벌 인재 파이프라인 · Foreign Worker Lifecycle</div>', '<div class="section-label mb-4"><span class="num">06</span> 글로벌 인재 파이프라인 · Foreign Worker Lifecycle</div>')
html = html.replace('<div class="section-label mb-4"><span class="num">06</span> MONO 브랜드 철학 · 스마트 일자리 플랫폼</div>', '<div class="section-label mb-4"><span class="num">07</span> MONO 브랜드 철학 · 스마트 일자리 플랫폼</div>')
html = html.replace('<div class="section-label mb-4"><span class="num">06</span> Next MONO = Tech-Blue</div>', '<div class="section-label mb-4"><span class="num">08</span> Next MONO = Tech-Blue</div>')

# 3. Inject Startup Section
injection_point = "<!-- ============================== S4 · STRATEGY ============================== -->"
new_injection = f"<!-- ============================== S3 · STARTUP ============================== -->\n{startup_html}\n\n{injection_point}"
html = html.replace(injection_point, new_injection)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Structure updated!")
