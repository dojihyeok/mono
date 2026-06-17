import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_section = """<!-- ============================== S6 · GLOBAL PIPELINE ============================== -->
<div class="tape-divider"></div>

<section id="global-pipeline" class="relative py-24 lg:py-32 bg-ink-900 text-warm-50 overflow-hidden">
  <div class="absolute inset-0 blueprint opacity-15 pointer-events-none"></div>
  <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-tech-500/10 rounded-full blur-[120px] pointer-events-none"></div>
  
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-6xl mb-16 reveal">
      <div class="section-label text-tech-400 mb-4"><span class="num bg-tech-400/20 text-tech-300">05</span> 글로벌 인재 파이프라인 · Foreign Worker Lifecycle</div>
      <h2 class="h-display text-warm-50 mb-6">외국인 기술자 생애주기 플랫폼</h2>
      <p class="body-lg text-warm-200 font-medium max-w-4xl leading-relaxed">
        대부분의 인력업체는 외국인 노동자의 "입국"까지만 책임집니다.<br />
        MONO는 구조적 인력난을 해결하기 위해 입국부터 정착, 근무, 성장, 그리고 장기 체류까지<br />
        <strong class="text-tech-300">외국인 기술자의 전체 생애주기</strong>를 관리하는 압도적 경쟁력을 구축합니다.
      </p>
    </div>

    <!-- 7-Step Lifecycle Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 reveal stagger">
      
      <!-- Step 1 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 01</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">해외 모집 네트워크</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• <span class="text-warm-100">대상 국가:</span> 인도네시아, 베트남, 필리핀, 네팔, 우즈베키스탄</li>
          <li>• 현지 직업훈련기관 및 채용업체 파트너십 구축</li>
        </ul>
      </div>

      <!-- Step 2 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 02</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">입국 전 사전 검증</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• 입국 전 디지털 프로필 (자격증, 경력) 등록</li>
          <li>• 비디오 인터뷰 및 기술 테스트</li>
          <li>• 기술 등급 체계 부여 (보조공/기능공/전문)</li>
        </ul>
      </div>

      <!-- Step 3 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 03</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">초기 정착 지원</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• <span class="text-warm-100">행정:</span> 외국인등록, 은행, 휴대전화</li>
          <li>• <span class="text-warm-100">생활:</span> 숙소 및 교통, 병원 안내</li>
          <li>• 안전 및 근로기준 사전 교육 (Welcome Package)</li>
        </ul>
      </div>

      <!-- Step 4 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 04</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">근무 및 다국어 지원</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• 디지털 출역 및 급여 관리</li>
          <li>• 현장 공지 및 작업 지시 다국어 자동 번역</li>
          <li>• (인니어, 베트남어, 영어 지원)</li>
        </ul>
      </div>

      <!-- Step 5 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 05</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">기술 성장 지원</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• 체계적 경력 관리 (근무일수, 교육이력)</li>
          <li>• 승급 체계: 보조공 ➔ 기능공 ➔ 전문 기술자 ➔ 현장 관리자</li>
        </ul>
      </div>

      <!-- Step 6 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 06</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">기업 대상 SaaS 지원</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• 비자 만료 및 체류 자격 자동 관리</li>
          <li>• 국적/기술/경력 기반 외국인 인재 서치풀</li>
        </ul>
      </div>

      <!-- Step 7 -->
      <div class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-sm hover:border-tech-400 transition-colors group md:col-span-2 lg:col-span-2 border-t-4 border-t-tech-400">
        <div class="text-tech-400 font-mono font-bold text-sm mb-3">STEP 07 (VISION)</div>
        <h3 class="text-xl font-bold text-warm-50 mb-3 group-hover:text-tech-300 transition-colors">장기 체류 및 정착 지원</h3>
        <ul class="text-sm text-warm-200 space-y-2 leading-relaxed">
          <li>• E-9 / H-2 인력의 숙련기능인력(E-7-4) 비자 전환 전폭 지원</li>
          <li>• 장기 체류자 대상 가족 주거, 교육, 생활 인프라 연계</li>
          <li>• <span class="text-tech-300 font-bold">대한민국 건설업의 구조적 인력 문제를 해결하는 파트너</span></li>
        </ul>
      </div>

    </div>

    <!-- BM Connection Box -->
    <div class="bg-gradient-to-r from-tech-900 to-ink-800 border border-tech-700/50 p-8 md:p-10 lcorner reveal">
      <h3 class="text-2xl font-black text-warm-50 mb-6 border-b border-tech-700/50 pb-4">수익 모델 연계 (BM)</h3>
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <h4 class="text-tech-400 font-bold mb-3 flex items-center gap-2"><i class="fa-solid fa-building"></i> 기업 (B2B)</h4>
          <ul class="text-warm-100 text-sm space-y-2">
            <li>• 외국인 채용 중개 수수료</li>
            <li>• 인력 관리 및 비자 관리 SaaS 구독료</li>
            <li>• 현장 안전/직무 교육 서비스</li>
          </ul>
        </div>
        <div>
          <h4 class="text-tech-400 font-bold mb-3 flex items-center gap-2"><i class="fa-solid fa-helmet-safety"></i> 기술자 (B2C)</h4>
          <ul class="text-warm-100 text-sm space-y-2">
            <li>• 승급 및 언어 교육비</li>
            <li>• 정착 지원(Welcome Package) 서비스</li>
            <li>• 혜택형 멤버십 구독</li>
          </ul>
        </div>
        <div>
          <h4 class="text-tech-400 font-bold mb-3 flex items-center gap-2"><i class="fa-solid fa-handshake"></i> 제휴 파트너십</h4>
          <ul class="text-warm-100 text-sm space-y-2">
            <li>• 해외 송금 서비스 수수료 연계</li>
            <li>• 상해 및 생활 보험 연계</li>
            <li>• 통신 개통 및 장기 숙소 연계</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</section>

"""

idx = content.find('<!-- ============================== S2 · LIFE CYCLE ============================== -->')

if idx != -1:
    content = content[:idx] + new_section + content[idx:]
    # Also change the Brand Philosophy section number from 05 to 06
    content = content.replace('<div class="section-label mb-4"><span class="num">05</span> MONO 브랜드 철학', '<div class="section-label mb-4"><span class="num">06</span> MONO 브랜드 철학')
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Section inserted successfully")
else:
    print("Could not find the target index")
