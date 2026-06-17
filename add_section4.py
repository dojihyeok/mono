import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

section_html = """
    <!-- SECTION 04: 1라운드 운영 전략 -->
    <section class="py-16 md:py-24 border-t border-ink-900/10 bg-white">
      <div class="max-w-7xl mx-auto px-5 lg:px-12">
        <div class="mb-10 md:mb-16">
          <div class="section-label mb-4"><span class="num">04</span> 1라운드 운영 전략</div>
          <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight max-w-3xl">
            T-Rive 팀의 1라운드(지역예선) 실행 계획 및 성장 전략
          </h2>
          <p class="body-lg mt-4 max-w-3xl">
            완성된 사업계획서 경쟁이 아닌, "가장 빠르게 배우고 성장하는 팀"을 목표로 합니다.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8">
            <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">1. 핵심 목표</div>
            <h3 class="text-2xl font-black text-ink-900 mb-4">완성된 서비스보다 성장하는 과정을 증명</h3>
            <p class="body-md mb-4">현재 MONO는 <strong>슈퍼패스를 통해 1라운드 진출이 확정</strong>된 상태입니다.</p>
            <p class="body-md">1라운드의 핵심은 "멘토의 조언을 얼마나 적극적으로 반영하며 성장하는가"를 보여주는 과정입니다. 따라서 T-Rive 팀은 적극적인 멘토링 참여와 빠른 실행을 통해 아이디어를 실제 제품으로 발전시키는 과정을 투명하게 공유하며 2라운드 진출을 준비하겠습니다.</p>
          </div>

          <div class="bg-white border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
            <div class="h-eyebrow mb-2">2. 멘토링 활용 전략</div>
            <h4 class="text-lg font-bold text-ink-900 mb-3">적극적인 피드백 반영 루프</h4>
            <ul class="body-md list-disc pl-5 space-y-1 mb-4 text-ink-800">
              <li>MONO 성장 전략(GTM) 및 비즈니스 모델(BM)</li>
              <li>MVP 범위 정의 및 시장 진입 전략</li>
              <li>투자 유치 및 정부 지원 연계 전략</li>
              <li>대기업 및 산업 파트너 협력 전략</li>
            </ul>
            <div class="bg-warm-100/50 p-4 rounded text-sm text-ink-800 border border-ink-900/10">
              <strong>반복 성장 과정:</strong> 피드백 정리 → 개선 사항 도출 → 전략 수정 → 결과 공유
            </div>
          </div>

          <div class="bg-white border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
            <div class="h-eyebrow mb-2">3. 규제 및 혁신 검토 과제</div>
            <h4 class="text-lg font-bold text-ink-900 mb-3">사전 규제 대응 및 혁신 서비스 활용</h4>
            <ul class="body-md list-disc pl-5 space-y-1 text-ink-800">
              <li>직업소개사업, 근로자 파견 규제</li>
              <li>전자계약, 전자금융, 대안신용평가 규제</li>
              <li>개인정보보호 및 외국인 근로자 규제</li>
              <li class="font-bold text-ink-900 mt-2">향후 검토 대상:</li>
              <li>규제샌드박스, 혁신금융서비스, 공공 API 활용, 디지털 경력 인증 체계</li>
            </ul>
          </div>

          <div class="bg-white border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
            <div class="h-eyebrow mb-2">4. 투자 전략 수립</div>
            <h4 class="text-lg font-bold text-ink-900 mb-3">VC 및 SI 전략적 접근</h4>
            <div class="space-y-4">
              <div>
                <span class="text-sm font-bold text-ink-900 block mb-1">VC 투자 전략</span>
                <p class="body-md text-ink-800">MVP 검증, 시장 규모, 차별성, 데이터 기반 확장 전략</p>
              </div>
              <div>
                <span class="text-sm font-bold text-ink-900 block mb-1">전략적 투자(SI) 대상</span>
                <p class="body-md text-ink-800">금융, 건설, 제조, 조선, 플랜트 (협력 가능 기업 및 기관 검토)</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
            <div class="h-eyebrow mb-2">5. 정부/파트너 협력 전략</div>
            <h4 class="text-lg font-bold text-ink-900 mb-3">공공·민간 네트워크 구축</h4>
            <p class="body-md text-ink-800 mb-2">고용노동부, 중소벤처기업부, 산업통상자원부, 한국산업인력공단, 근로복지공단, 기술 관련 협회 등 대상 검토</p>
            <div class="mt-4 pt-4 border-t border-ink-900/10">
              <span class="text-sm font-bold text-ink-900 block mb-1">향후 추진 과제</span>
              <p class="body-md text-ink-800">업무협약(MOU), 시범사업, 공동 연구, 실증사업</p>
            </div>
          </div>

          <div class="bg-white border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
            <div class="h-eyebrow mb-2">6. MVP 방향 및 공유</div>
            <h4 class="text-lg font-bold text-ink-900 mb-3">지속적인 프로덕트 고도화</h4>
            <ul class="body-md list-decimal pl-5 space-y-1 text-ink-800 mb-4">
              <li>기술자 회원 가입</li>
              <li>경력 관리</li>
              <li>일자리 매칭</li>
              <li>안심 정산</li>
              <li>기업용 현장 관리 기능</li>
            </ul>
            <p class="body-md text-ink-800">멘토링 과정 중 <strong>화면 설계, 서비스 흐름, 기술 구조</strong>를 지속 개선하여 공유합니다.</p>
          </div>

          <div class="bg-warm-100 border border-ink-900/10 p-6 md:p-8 shadow-blueprint flex flex-col justify-center">
            <div class="h-eyebrow mb-2">7/8. 지원금 활용 계획</div>
            
            <div class="mb-6">
              <h4 class="text-lg font-bold text-ink-900 mb-1">200만원 지원금 (1라운드)</h4>
              <p class="text-sm font-bold text-tech-600 mb-2">목표: 실행 가능한 MVP 검증</p>
              <p class="body-md text-ink-800">UI/UX 개선, 서비스 기획, 프로토타입 개발, 서버 및 인프라 구축, 테스트 환경 구성, 사용자 인터뷰</p>
            </div>

            <div class="pt-6 border-t border-ink-900/10">
              <h4 class="text-lg font-bold text-ink-900 mb-1">1,000만원 지원금 (2라운드 진출 시)</h4>
              <p class="text-sm font-bold text-tech-600 mb-2">목표: 실제 서비스 검증</p>
              <p class="body-md text-ink-800">MVP 개발 고도화, 사용자 테스트, 기업 인터뷰, 기술자 인터뷰, 데이터 구축, 시범 운영</p>
            </div>
          </div>

        </div>
      </div>
    </section>
"""

# Insert before footer
target = '<footer class="bg-warm-50 border-t border-ink-900/10 py-10">'
if target in html:
    html = html.replace(target, section_html + '\n    ' + target)
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully added Section 04!")
else:
    print("Could not find footer tag.")
