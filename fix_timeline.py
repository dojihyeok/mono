import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# R1
r1_new = '''<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">
        <span class="vstep-dot">1</span>
        <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
          <div class="md:w-1/3">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R1-지역 예선</div>
            <h3 class="text-xl font-black text-ink-900">멘토 기관 및 멘토의 관찰&서면 평가</h3>
          </div>
          <div class="md:w-2/3 bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm">
            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">500명</div>
            </div>
            <div>
              <span class="text-sm font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-lg text-ink-800 leading-relaxed">초기 시제품 (MVP) 제작 비용 최대 1천만원 + 책임멘토링 및 기술 멘토링</div>
            </div>
          </div>
        </div>
      </article>'''

# R2
r2_new = '''<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">
        <span class="vstep-dot">2</span>
        <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
          <div class="md:w-1/3">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R2-지역 오디션</div>
            <h3 class="text-xl font-black text-ink-900">지역별 멘토 기관 대상 공개 IR 오디션</h3>
          </div>
          <div class="md:w-2/3 bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm">
            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">200명</div>
            </div>
            <div>
              <span class="text-sm font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-lg text-ink-800 leading-relaxed">초기 시제품 (MVP) 제작 비용 최대 1천만원 + 책임 멘토링 + 선배 멘토링</div>
            </div>
          </div>
        </div>
      </article>'''

# R3
r3_new = '''<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">
        <span class="vstep-dot">3</span>
        <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
          <div class="md:w-1/3">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">R3-권역 오디션</div>
            <h3 class="text-xl font-black text-ink-900">기술분야별 전문 투자사 대상 권역별 비공개 IR 오디션</h3>
          </div>
          <div class="md:w-2/3 bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm">
            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">100명</div>
            </div>
            <div>
              <span class="text-sm font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-lg text-ink-800 leading-relaxed">차년도 사업 연계를 통한 사업화 자금 최대 1억원 + 책임 멘토링</div>
            </div>
          </div>
        </div>
      </article>'''

# R4
r4_new = '''<article class="relative bg-warm-100 text-ink-900 border border-ink-200 lcorner lcorner-tech p-6 lg:p-8 shadow-blueprint">
        <span class="vstep-dot" style="background:#FFD200;color:#0A0F1A;">4</span>
        <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
          <div class="md:w-1/3">
            <div class="chip bg-warm-200 text-ink-900 border border-ink-200 mb-3">R4-전국 오디션</div>
            <h3 class="text-xl font-black text-ink-900">파이널 오디션</h3>
          </div>
          <div class="md:w-2/3 bg-white border border-ink-900/10 p-6 rounded-xl shadow-sm">
            <div class="mb-5">
              <span class="text-sm font-bold text-ink-500 mb-1 block">선발 인원</span>
              <div class="text-2xl font-black text-ink-900">100명의 경연 → 우승자 선정</div>
            </div>
            <div>
              <span class="text-sm font-bold text-ink-500 mb-1 block">지원 내용</span>
              <div class="text-lg text-ink-800 leading-relaxed">최종우승자 상금 및 투자금 최대 10억원 지원</div>
            </div>
          </div>
        </div>
      </article>'''

# We need to replace the entire <article> blocks for each round.
# Using regex to find and replace them safely.
import re

html = re.sub(r'<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">\s*<span class="vstep-dot">1</span>.*?</article>', r1_new, html, flags=re.DOTALL)
html = re.sub(r'<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">\s*<span class="vstep-dot">2</span>.*?</article>', r2_new, html, flags=re.DOTALL)
html = re.sub(r'<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">\s*<span class="vstep-dot">3</span>.*?</article>', r3_new, html, flags=re.DOTALL)
html = re.sub(r'<article class="relative bg-warm-100 text-ink-900 border border-ink-200 lcorner lcorner-tech p-6 lg:p-8">\s*<span class="vstep-dot" style="background:#FFD200;color:#0A0F1A;">4</span>.*?</article>', r4_new, html, flags=re.DOTALL)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated timeline cards.")
