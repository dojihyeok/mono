import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Section 01: Native App Style List
old_sec1_mobile = """      <!-- Mobile Only Simplified Text -->
      <ul class="block md:hidden space-y-3 mt-6 bg-warm-100 p-4 border border-ink-900/10 lcorner">
        <li class="flex items-start gap-2 text-ink-800 text-[15px] leading-snug"><i class="fa-solid fa-check text-tech-600 mt-[2px] w-4"></i> <span style="word-break:keep-all;">국가 핵심 기술노동 산업 통합 <b>디지털 인력사무소</b></span></li>
        <li class="flex items-start gap-2 text-ink-800 text-[15px] leading-snug"><i class="fa-solid fa-check text-tech-600 mt-[2px] w-4"></i> <span style="word-break:keep-all;">근무자에게는 <b>스마트 일자리 플랫폼</b> 제공</span></li>
        <li class="flex items-start gap-2 text-ink-800 text-[15px] leading-snug"><i class="fa-solid fa-check text-tech-600 mt-[2px] w-4"></i> <span style="word-break:keep-all;">기업에게는 검증된 숙련 인력 <b>즉시 배치</b></span></li>
      </ul>"""

new_sec1_mobile = """      <!-- Mobile Only Simplified Text (App Style) -->
      <div class="block md:hidden mt-6 bg-white border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3">
          <div class="bg-tech-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-tech-600 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">국가 핵심 기술노동 산업 통합 <strong class="font-bold">디지털 인력사무소</strong></p>
        </div>
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3 bg-warm-50/50">
          <div class="bg-tech-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-tech-600 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">근무자에게는 <strong class="font-bold">스마트 일자리 플랫폼</strong> 제공</p>
        </div>
        <div class="p-4 flex items-start gap-3">
          <div class="bg-tech-100 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-tech-600 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">기업에게는 검증된 숙련 인력 <strong class="font-bold">즉시 배치</strong></p>
        </div>
      </div>"""

if old_sec1_mobile in html:
    html = html.replace(old_sec1_mobile, new_sec1_mobile)

# 2. Section 02: Mobile Summary list
old_sec2_list = """      <!-- Mobile Only: Problem List Summary -->
      <div class="block md:hidden">
        <h3 class="text-xl font-black text-ink-900 mb-6" style="word-break:keep-all;">현장이 직면한 핵심 과제와 해결책</h3>
        <div class="space-y-3">
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 객관적인 기술 경력 증빙의 어려움</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 위변조 불가능한 블록체인 신뢰 이력서 제공</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 기술 전수 단절과 외국인 기술자 관리 체계 부재</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 외국인 기술자 맞춤형 인증 및 멘토링 연계</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 기술자에 대한 금융 불이익</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 근무 및 안전 데이터 기반 금융 혜택 모델(Tech-Fi)</p>
          </div>
          <div class="bg-warm-50 p-4 border border-ink-900/10 lcorner">
            <p class="text-[13px] font-bold text-ink-900">문제: 고위험 반복 작업에 따른 인력 이탈</p>
            <p class="text-[12px] text-tech-700 mt-1">해결: 데이터 기반 스마트 안전장비 및 로보틱스 연계</p>
          </div>
        </div>
      </div>"""

new_sec2_list = """      <!-- Mobile Only: Problem List Summary (App Style) -->
      <div class="block md:hidden mt-8">
        <h3 class="text-lg font-bold text-ink-900 mb-4 tracking-tight" style="word-break:keep-all;">현장 과제와 해결책</h3>
        <div class="bg-white border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
          <div class="p-4 border-b border-ink-900/5">
            <p class="text-[12px] font-bold text-ink-500 mb-1 tracking-tight">문제: 객관적인 기술 경력 증빙 불가</p>
            <p class="text-[14px] font-bold text-ink-900 leading-[1.4] tracking-tight">해결: 위변조 불가능한 신뢰 이력서</p>
          </div>
          <div class="p-4 border-b border-ink-900/5 bg-warm-50/50">
            <p class="text-[12px] font-bold text-ink-500 mb-1 tracking-tight">문제: 기술 단절 및 외국인 관리 부재</p>
            <p class="text-[14px] font-bold text-ink-900 leading-[1.4] tracking-tight">해결: 외국인 인증 및 멘토링 연계</p>
          </div>
          <div class="p-4 border-b border-ink-900/5">
            <p class="text-[12px] font-bold text-ink-500 mb-1 tracking-tight">문제: 기술자에 대한 금융 불이익</p>
            <p class="text-[14px] font-bold text-ink-900 leading-[1.4] tracking-tight">해결: 데이터 기반 금융 혜택 (Tech-Fi)</p>
          </div>
          <div class="p-4">
            <p class="text-[12px] font-bold text-ink-500 mb-1 tracking-tight">문제: 고위험 작업에 따른 이탈</p>
            <p class="text-[14px] font-bold text-ink-900 leading-[1.4] tracking-tight">해결: 데이터 기반 스마트 안전장비 연계</p>
          </div>
        </div>
      </div>"""

if old_sec2_list in html:
    html = html.replace(old_sec2_list, new_sec2_list)

# 3. Apply line-height globally to all headers and subheaders
# h-display has leading-tight, but let's make sure our mobile h2/h3 are tight
html = re.sub(r'class="h-display text-ink-900([^"]*)"', r'class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight\1"', html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Applied native app style typography and list designs.")
