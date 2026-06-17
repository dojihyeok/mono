import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Hide Desktop grids
html = html.replace('<div class="grid md:grid-cols-2 gap-6 lg:gap-8 stagger">', '<div class="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 stagger">')
html = html.replace('<div class="mt-12 mb-10 stagger w-full mx-auto">', '<div class="hidden md:block mt-12 mb-10 stagger w-full mx-auto">')
html = html.replace('<div class="mt-10 w-full mx-auto  px-6 py-5 flex flex-col lg:flex-row', '<div class="hidden md:flex mt-10 w-full mx-auto  px-6 py-5 flex-col lg:flex-row')

mobile_cards = """
    <!-- Mobile Only: 6 Simple Cards (from mono_test.html) -->
    <div class="block md:hidden grid grid-cols-1 gap-4 mt-8">
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-file-signature text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">근무기록 관리</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">수기 영수증이나 종이 장부 대신, 언제 어디서 일했는지 성실한 경력 내역을 스마트폰에 투명하게 영구 기록합니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-database text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">출역 데이터 축적</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">위치(GPS) 인증을 연동해 위변조가 불가능한 일용직 출퇴근 근무기록을 축적하여 일터 신뢰 장부의 근간을 이룹니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-shield-halved text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">안전 연동 및 안심 정산</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">출근 전 간편 안전 교육 이수 로그를 실시간 남기고, 정산 체계를 에스크로(안전지갑)로 묶어 임금 체불 공포를 완전히 해결합니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-user-check text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">현장 평판 및 신뢰 데이터</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">무단결근 배제율과 현장 반장/소장의 상호 평점 결과를 수치화하여 기술자 고유의 대안 신뢰 점수(S-Core)를 보증합니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-building-columns text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">금융 및 혜택 연결</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">그동안 일회성이라 금융에서 소외받던 성실 근로자들에게 1금융권 저금리 전세 대출 한도와 단체 상해보험을 연계합니다.</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-ink-900/10 shadow-sm space-y-3">
        <div class="p-2.5 bg-tech-50 text-tech-700 rounded-lg w-fit border border-tech-100">
          <i class="fa-solid fa-laptop-code text-lg"></i>
        </div>
        <h3 class="text-base font-black text-ink-900">기업용 서비스 (SaaS)</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">하청 소장의 골머리를 썩이던 4대 보험 신고, 세무 신고, 출역 관제 복잡성을 마우스 클릭 한 번으로 자동 대행해 줍니다.</p>
      </div>
    </div>
"""

# Insert mobile_cards just before the Data layer bottom strip which is now hidden md:flex
if '<div class="hidden md:flex mt-10 w-full mx-auto  px-6 py-5 flex-col lg:flex-row items-start lg:items-center justify-between gap-4 overflow-hidden group">' in html:
    html = html.replace(
        '<div class="hidden md:flex mt-10 w-full mx-auto  px-6 py-5 flex-col lg:flex-row items-start lg:items-center justify-between gap-4 overflow-hidden group">', 
        mobile_cards + '\n    <div class="hidden md:flex mt-10 w-full mx-auto  px-6 py-5 flex-col lg:flex-row items-start lg:items-center justify-between gap-4 overflow-hidden group">'
    )
else:
    print("Could not find the target for insertion.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Section 1 mobile update applied.")

