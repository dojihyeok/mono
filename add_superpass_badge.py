import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

r1_chip_old = """          <div class="md:w-1/3 pl-10 sm:pl-12">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">지역 예선</div>
            <h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>
          </div>"""

r1_chip_new = """          <div class="md:w-1/3 pl-10 sm:pl-12">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 m-0">지역 예선</div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-tech-400/30 bg-gradient-to-r from-tech-600 to-tech-800 text-warm-50 text-[12px] font-black tracking-wide shadow-sm">
                <i class="fa-solid fa-bolt text-[#FFD200]"></i> 슈퍼패스 합격
              </div>
            </div>
            <h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>
          </div>"""

html = html.replace(r1_chip_old, r1_chip_new)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added Super Pass badge")
