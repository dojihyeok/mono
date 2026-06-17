import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix header
html = html.replace('7단계 스케일업 로드맵', '6단계 스케일업 로드맵')
html = html.replace('7단계로 이어지는', '6단계로 이어지는')

new_steps = """<!-- Step 1 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-ink-900 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-ink-900 transition-colors duration-500">
              01
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-warm-50 text-ink-900 border border-ink-200">첫걸음</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 확보</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>가입 절차 혁신:</strong> 회원가입 시 제출 서류 최소화, 간편인증 연동, 건강보험 자격 정보 및 주민등록등본 자동 제출 지원</li>
              <li><strong>경력 자동 인증:</strong> 자격증 자동 등록, 관련 협회 경력 연동, 교육 이수 내역 연동, 현장 경력 포트폴리오 구축</li>
              <li><strong>외국인 기술자 통합 관리:</strong> 해외 현지 모집 파트너십 구축, 입국 전 사전 검증(디지털 프로필/비디오 인터뷰), 입국 직후 맞춤형 안전·문화 교육, 근무 이력 데이터화를 통한 E-7 비자 전환 지원 등 <strong class="text-ink-900">외국인 생애주기 밀착 지원</strong></li>
            </ul>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-ink-900 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-ink-900 transition-colors duration-500">
              02
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-warm-50 text-ink-900 border border-ink-200">연결 & 동행</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">일자리 연결 & 파트너사 확보</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>기술자 일자리 연결:</strong> 지역 기반 일자리 추천, 기술 분야별 맞춤 추천, 급여 조건 비교, 장기 근무 현장 추천, 현장 평가 기반 추천</li>
              <li><strong>파트너사 채용 지원:</strong> 공고 등록 간소화, 반복 채용 템플릿, 우수 인재 추천 기능</li>
              <li><strong>파트너사 행정 지원:</strong> 출역 관리, 근태 관리, 계약 관리, 정산 지원, 4대 보험 관리 대행</li>
            </ul>
          </div>
        </div>

        <!-- Step 3 (Was 5) -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-ink-900 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-ink-900 transition-colors duration-500">
              03
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-warm-50 text-ink-900 border border-ink-200">상생</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">현장 반장 및 인력사무소 상생</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3 mb-4">
              <li><strong>현장 반장:</strong> 디지털 출역 관리, 인력 배치 관리, 기술자 평가 관리, 우수 인력 추천 기능</li>
              <li><strong>인력사무소:</strong> 디지털 인력사무소 운영 인프라, 인력 데이터베이스 제공, 정산 자동화, 채용 관리 지원</li>
            </ul>
            <div class="p-4 bg-warm-50 border border-ink-200 rounded-sm">
              <p class="text-sm font-bold text-ink-900">MONO는 현장 반장과 인력사무소를 대체하지 않습니다. 현장의 경험과 신뢰를 디지털 기술과 연결하여 더 많은 기회를 만드는 상생 플랫폼입니다.</p>
            </div>
          </div>
        </div>

        <!-- Step 4 (Was 3) -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-ink-900 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-ink-900 transition-colors duration-500">
              04
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-safety-tape text-ink-900 border border-safety-amber/50 font-bold">현장 지원</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">현장 생활 지원</h3>
            <p class="body-md text-ink-800 font-bold mb-3">목적: 기술자의 하루를 지원하는 생활 인프라 구축</p>
            <ul class="body-md text-ink-700 leading-relaxed space-y-2">
              <li><i class="fa-solid fa-utensils text-tech-600 w-5"></i> 현장 주변 식당 정보 및 도시락 식사 서비스</li>
              <li><i class="fa-solid fa-bed text-tech-600 w-5"></i> 숙박 시설 정보 및 쾌적한 휴식 공간 정보</li>
              <li><i class="fa-solid fa-shower text-tech-600 w-5"></i> 샤워 및 운동 시설 정보</li>
              <li><i class="fa-solid fa-hospital text-tech-600 w-5"></i> 병원 및 의료시설 정보</li>
            </ul>
          </div>
        </div>

        <!-- Step 5 (Was 4) -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-ink-900 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-700 group-hover/step:text-ink-900 transition-colors duration-500">
              05
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-900/10 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-warm-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-warm-50 text-ink-900 border border-ink-200">성장</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">기술자 성장 지원</h3>
            <ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>기술 이력 관리:</strong> 근무 이력, 자격증, 교육 이력, 안전 교육 이력 자산화</li>
              <li><strong>금융 연결:</strong> 근무 기록 기반 신뢰 데이터로 대출 등 금융 서비스 연계 및 보험 연계</li>
              <li><strong>교육 지원:</strong> 안전 교육, 기술 교육, 자격증 교육, 해외 취업 교육 지원</li>
            </ul>
          </div>
        </div>

        <!-- Step 6 (Restored to original text) -->
        <div class="relative flex flex-col md:flex-row gap-4 md:gap-8 group/step hover-lift">
          <div class="flex-shrink-0 flex items-center md:items-start gap-4">
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-warm-50 border-4 border-warm-50 shadow-neo-soft flex items-center justify-center text-tech-500 font-black text-xl md:text-2xl z-10 group-hover/step:bg-tech-500 group-hover/step:text-ink-900 transition-colors duration-500">
              06
            </div>
          </div>
          <div class="hyper-glow-box bg-warm-50/95 lcorner p-6 md:p-8 flex-1 shadow-blueprint border border-ink-200 relative">
            <div class="absolute w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-tech-50/95 border-b-[10px] border-b-transparent -left-[15px] top-5 hidden md:block drop-shadow-sm"></div>
            <div class="flex items-center gap-2 mb-2">
              <span class="chip bg-tech-500 text-ink-900 font-bold border border-ink-900">도약</span>
            </div>
            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">글로벌 확장</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold">해외 일자리 연결, 비자 지원 정보 제공, 해외 정착 지원, 글로벌 경력 관리 연동.</p>
          </div>
        </div>"""

pattern = re.compile(r'<!-- Step 1 -->.*?</div>\s*</div>\s*</div>\s*</div>', re.DOTALL)
html = pattern.sub(new_steps + "\n\n      </div>", html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Steps reorganized successfully.")
