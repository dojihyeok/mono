import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R1 replacement
r1_old = """            <div class="mb-5">
              <span class="text-[15px] font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-[28px] font-black text-ink-900">500명</div>
            </div>"""
r1_new = """            <div class="mb-5 flex flex-wrap items-center gap-6">
              <div>
                <span class="text-[14px] md:text-[15px] font-bold text-ink-500 mb-1 block">참여 인원</span>
                <div class="text-[20px] md:text-[22px] font-bold text-ink-700">4,000명</div>
              </div>
              <div class="w-px h-8 bg-ink-900/15"></div>
              <div>
                <span class="text-[14px] md:text-[15px] font-bold text-tech-600 mb-1 block">선발 인원</span>
                <div class="text-[24px] md:text-[28px] font-black text-ink-900">500명</div>
              </div>
            </div>"""

html = html.replace(r1_old, r1_new)

# R2 replacement
r2_old = """            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">200명</div>
            </div>"""
r2_new = """            <div class="mb-5 flex flex-wrap items-center gap-6">
              <div>
                <span class="text-[13px] md:text-sm font-bold text-ink-500 mb-1 block">참여 인원</span>
                <div class="text-[18px] md:text-xl font-bold text-ink-700">500명</div>
              </div>
              <div class="w-px h-8 bg-ink-900/15"></div>
              <div>
                <span class="text-[13px] md:text-sm font-bold text-tech-600 mb-1 block">선발 인원</span>
                <div class="text-[22px] md:text-[24px] font-black text-ink-900">200명</div>
              </div>
            </div>"""

html = html.replace(r2_old, r2_new)

# R3 replacement
r3_old = """            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">100명</div>
            </div>"""
r3_new = """            <div class="mb-5 flex flex-wrap items-center gap-6">
              <div>
                <span class="text-[13px] md:text-sm font-bold text-ink-500 mb-1 block">참여 인원</span>
                <div class="text-[18px] md:text-xl font-bold text-ink-700">200명</div>
              </div>
              <div class="w-px h-8 bg-ink-900/15"></div>
              <div>
                <span class="text-[13px] md:text-sm font-bold text-tech-600 mb-1 block">선발 인원</span>
                <div class="text-[22px] md:text-[24px] font-black text-ink-900">100명</div>
              </div>
            </div>"""

html = html.replace(r3_old, r3_new)

# R4 replacement
r4_old = """            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">TOP 10 선발 → 국민 평가 거쳐 최종 우승 1인 포함 5명 수상</div>
            </div>"""
r4_new = """            <div class="mb-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div class="shrink-0">
                <span class="text-[13px] md:text-sm font-bold text-ink-500 mb-1 block">참여 인원</span>
                <div class="text-[18px] md:text-xl font-bold text-ink-700">100명</div>
              </div>
              <div class="hidden sm:block w-px h-8 bg-ink-900/15"></div>
              <div>
                <span class="text-[13px] md:text-sm font-bold text-tech-600 mb-1 block">최종 선발</span>
                <div class="text-[20px] md:text-[22px] font-black text-ink-900">TOP 10 선발 → 최종 5명 수상 (1위 포함)</div>
              </div>
            </div>"""

html = html.replace(r4_old, r4_new)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated participants")
