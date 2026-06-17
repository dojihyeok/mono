import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Hide GTM Stepper
html = html.replace('<div class="relative w-full z-10 reveal">', '<div class="relative w-full z-10 reveal hidden md:block">')

mobile_cards = """
    <!-- Mobile Only: Growth Strategy (from mono_test.html) -->
    <div class="block md:hidden mt-8 mb-12">
      <div class="space-y-4">
        <div class="bg-white border border-ink-900/10 p-5 rounded-2xl shadow-sm flex gap-4 items-start">
          <div class="bg-tech-50 text-tech-700 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-tech-100">1</div>
          <div>
            <h3 class="text-[15px] font-black text-ink-900 mb-1">현장 노무 & 정산 관리</h3>
            <p class="text-[13px] text-ink-700 leading-relaxed word-keep">현장의 가장 고질적인 임금 체불과 수기 관리를 B2B SaaS로 자동화합니다.</p>
          </div>
        </div>
        <div class="bg-white border border-ink-900/10 p-5 rounded-2xl shadow-sm flex gap-4 items-start">
          <div class="bg-tech-50 text-tech-700 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-tech-100">2</div>
          <div>
            <h3 class="text-[15px] font-black text-ink-900 mb-1">기술자 생애주기 케어</h3>
            <p class="text-[13px] text-ink-700 leading-relaxed word-keep">안전 교육, 출역 데이터, 생활 웰니스, 그리고 금융을 연결합니다.</p>
          </div>
        </div>
        <div class="bg-white border border-ink-900/10 p-5 rounded-2xl shadow-sm flex gap-4 items-start">
          <div class="bg-tech-50 text-tech-700 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-tech-100">3</div>
          <div>
            <h3 class="text-[15px] font-black text-ink-900 mb-1">글로벌 기술 영토 확장</h3>
            <p class="text-[13px] text-ink-700 leading-relaxed word-keep">내국인 중심에서 외국인 비자 및 다국어 지원으로 생태계를 넓힙니다.</p>
          </div>
        </div>
        <div class="bg-white border border-ink-900/10 p-5 rounded-2xl shadow-sm flex gap-4 items-start">
          <div class="bg-tech-50 text-tech-700 font-black text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-tech-100">4</div>
          <div>
            <h3 class="text-[15px] font-black text-ink-900 mb-1">미래 기술 & 로보틱스</h3>
            <p class="text-[13px] text-ink-700 leading-relaxed word-keep">데이터를 기반으로 현장 자동화 및 건설 로봇과 협업하는 인프라를 구축합니다.</p>
          </div>
        </div>
      </div>
    </div>
"""

# Insert mobile_cards after the hidden GTM stepper. The stepper ends with a closing div just before </section>.
# It's better to insert right before `</section>` of section 04 (id="gtm")
if '</section>\n\n\n<div class="tape-divider"></div>\n\n<!-- ============================== S5' in html:
    html = html.replace('</section>\n\n\n<div class="tape-divider"></div>\n\n<!-- ============================== S5', mobile_cards + '\n  </div>\n</section>\n\n\n<div class="tape-divider"></div>\n\n<!-- ============================== S5')
else:
    print("Could not find the target for insertion of sec4.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 4 mobile update applied.")
