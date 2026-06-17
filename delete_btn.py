import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix the fluorescent color text
target_color1 = '<li class="col-span-2 mt-1 pt-1 border-t border-tech-600/30 text-tech-300">· 장비 구독(EaaS)</li>'
replacement_color1 = '<li class="col-span-2 mt-1 pt-1 border-t border-tech-600/30 text-tech-700 font-bold">· 장비 구독(EaaS)</li>'
html = html.replace(target_color1, replacement_color1)

target_color2 = '<li class="col-span-2 text-tech-300">· 로보틱스 서비스(RaaS)</li>'
replacement_color2 = '<li class="col-span-2 text-tech-700 font-bold">· 로보틱스 서비스(RaaS)</li>'
html = html.replace(target_color2, replacement_color2)

# 2. Delete the button
target_btn = """        <a href="mailto:contact@t-rive.io" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-50 border border-ink-900/20 text-ink-900 font-bold hover:bg-warm-100 hover:text-ink-900 transition-colors rounded-lg shadow-sm group">
          <i class="fa-solid fa-envelope text-tech-600 group-hover:text-ink-800"></i> 팀과 대화하기
        </a>"""
html = html.replace(target_btn, "")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Changes applied!")
