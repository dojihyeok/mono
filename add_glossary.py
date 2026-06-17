import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

glossary_html = """
    <!-- Glossary Widget -->
    <div class="mt-16 w-full mx-auto reveal">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-8 h-8 rounded bg-ink-900 text-warm-50 flex items-center justify-center text-sm"><i class="fa-solid fa-book"></i></span>
        <h3 class="text-xl font-black text-ink-900 tracking-tight">MONO 용어 사전 <span class="text-[13px] font-normal text-ink-500 ml-2">쉽게 이해하는 MONO의 핵심 기술</span></h3>
      </div>
      <div class="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        
        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Alternative CB</div>
          <div class="text-base font-black text-ink-900 mb-3">대안 신용평가</div>
          <p class="body-sm text-ink-700 leading-relaxed">일당 소득 때문에 은행 문턱을 넘기 힘들던 기술자를 위한 성실도 기반의 새로운 금융 신용 평가</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Software as a Service</div>
          <div class="text-base font-black text-ink-900 mb-3">SaaS (기업용 업무관리)</div>
          <p class="body-sm text-ink-700 leading-relaxed">현장 소장들이 복잡하게 처리하던 출퇴근 행정, 4대 보험, 정산 업무를 원클릭 자동화하는 소프트웨어 비서</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Robot as a Service</div>
          <div class="text-base font-black text-ink-900 mb-3">RaaS (구독형 현장 로봇)</div>
          <p class="body-sm text-ink-700 leading-relaxed">고가의 특수 로봇을 구매할 필요 없이 현장에서 필요한 기간만큼만 빌려 쓰는 합리적 렌탈 모델</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Over The Air</div>
          <div class="text-base font-black text-ink-900 mb-3">OTA (원격 무선 업데이트)</div>
          <p class="body-sm text-ink-700 leading-relaxed">현장에 가지 않고도 무선망을 통해 로봇의 인공지능을 실시간으로 업데이트하여 업그레이드하는 기술</p>
        </div>

        <div class="min-w-[280px] w-[280px] shrink-0 bg-warm-50 border border-ink-900/15 lcorner p-5 shadow-sm snap-start bg-tech-50/50 border-tech-700/30">
          <div class="text-[11px] font-mono text-tech-700 font-bold mb-1">Future Master</div>
          <div class="text-base font-black text-ink-900 mb-3">Tech-Blue (미래 기술 장인)</div>
          <p class="body-sm text-ink-700 leading-relaxed">고되고 험한 단순 작업은 로봇에게 맡기고, 스마트 기기로 로봇을 지휘 통제하는 차세대 기술 전문가</p>
        </div>

      </div>
    </div>
"""

# Find the end of the platform section (right before `</section>`)
# Let's insert it before `  </div>\n</section>\n\n<section id="gtm"`
target_str = '  </div>\n</section>\n\n<section id="gtm"'
if target_str in content:
    content = content.replace(target_str, glossary_html + "\n" + target_str)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Glossary widget added successfully")
else:
    print("Could not find insertion point")
