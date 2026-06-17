import re

with open('/tmp/startup_section.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Change ID
html = html.replace('id="gtm"', 'id="startup"')

# Change Title & Num
html = html.replace('<div class="h-eyebrow mb-3"><span class="inline-block w-6 h-px bg-tech-700 align-middle mr-2"></span>제4막 · MoNo가 해결해야 하는 GTM 전략</div>', '<div class="section-label mb-4"><span class="num">03</span> 모두의 창업 오디션 전략</div>')

# Fix Theme
html = html.replace('bg-ink-900 text-tech-300', 'bg-warm-100 text-ink-900 border border-ink-900/10')
html = html.replace('bg-tech-50', 'bg-warm-50')
html = html.replace('bg-tech-100', 'bg-warm-100')
html = html.replace('text-tech-800', 'text-ink-900')
html = html.replace('text-tech-700', 'text-ink-900')
html = html.replace('border-tech-700/20', 'border-ink-200')
html = html.replace('border-tech-500/30', 'border-ink-200')
html = html.replace('border-tech-200', 'border-ink-200')

with open('/tmp/startup_section.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("formatted startup section")
