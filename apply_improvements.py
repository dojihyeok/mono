import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Tap Targets
html = html.replace('w-10 h-10 border border-ink-900/15', 'w-12 h-12 border border-ink-900/15')
html = html.replace('id="mobileMenuCloseBtn" aria-label="메뉴 닫기" class="w-8 h-8 flex', 'id="mobileMenuCloseBtn" aria-label="메뉴 닫기" class="w-11 h-11 flex')

# 2. Performance (Lazy Loading)
html = html.replace('<img src="images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-cover" />', '<img src="images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-cover" loading="lazy" />')

# 3. SEO (Open Graph)
og_tags = """<meta name="description" content="MONO 6막 통합 전략서 — The Platform · The Life Cycle · Problem & Solution · Tournament Strategy · Business Model & Valuation · The Next MONO Vision." />
<meta property="og:title" content="MONO · 기술자의 경험이 자산이 되는 스마트 현장 플랫폼" />
<meta property="og:description" content="MONO 6막 통합 전략서 — The Platform · The Life Cycle · Problem & Solution · Tournament Strategy · Business Model & Valuation · The Next MONO Vision." />
<meta property="og:image" content="/images/next_mono_evolution.jpg" />
<meta property="og:type" content="website" />"""

html = html.replace('<meta name="description" content="MONO 6막 통합 전략서 — The Platform · The Life Cycle · Problem & Solution · Tournament Strategy · Business Model & Valuation · The Next MONO Vision." />', og_tags)

# 4. Overflow Wrap
html = html.replace('<body class="bg-warm-50 text-ink-900 antialiased relative selection:bg-tech-200 selection:text-ink-900">', '<body class="bg-warm-50 text-ink-900 antialiased relative selection:bg-tech-200 selection:text-ink-900 break-words">')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Improvements applied!")
