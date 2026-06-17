import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Phase 4 content
phase4_old = """<h4 class="text-lg font-bold text-ink-900 mb-2">이주민 패스 &amp; 웰니스 캠프</h4>
            <p class="text-ink-600 text-[12.5px] xl:text-[13px] tracking-tighter xl:whitespace-nowrap" style="word-break:keep-all;">E-7-4 비자 전환 지원 및 농어촌 모듈러 베이스캠프 인프라 확충</p>"""

phase4_new = """<h4 class="text-lg font-bold text-ink-900 mb-2">이주민 패스 &amp; 웰니스 캠프</h4>
            <ul class="text-ink-600 text-[12px] xl:text-[13px] tracking-tight space-y-1 mt-2 text-left" style="word-break:keep-all;">
              <li><strong>해외 인재 확보:</strong> 현지 교육기관 협력, 사전 기술 검증, 한국어 교육</li>
              <li><strong>국내 정착 지원:</strong> 숙소, 의료, 금융, 생활 정보 안내</li>
              <li><strong>장기 성장 지원:</strong> E-7-4 전환, 숙련기능인력 육성, 장기 체류 지원</li>
            </ul>"""

html = html.replace(phase4_old, phase4_new)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated Next MONO Phase 4.")
