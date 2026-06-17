import os

files_to_update = [
    '/Users/yunhyeok/mono/public/pitch.html',
    '/Users/yunhyeok/mono/test.html',
    '/Users/yunhyeok/mono/temp_pitch_only.html',
    '/Users/yunhyeok/mono/temp_pitch/client/public/pitch.html'
]

r2_summary = """        <!-- Strategy Summary Box (Full width bottom) -->
        <div class="mt-8 pt-7 border-t border-ink-900/10">
          <div class="flex items-center justify-start gap-4 mb-5">
            <span class="text-[17px] font-black text-ink-900">2라운드 준비 전략</span>
            <button onclick="document.getElementById('r2-strategy-modal').showModal()" class="text-[15px] font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1.5 transition-colors">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> 상세 보기
            </button>
          </div>
          <div class="bg-transparent">
            <ul class="text-[16px] text-ink-800 space-y-3.5 list-none p-0 m-0">
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">핵심 목표:</strong> 기능 개발이 아닌 데이터 기반 시장 검증 집중</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">검증 가설:</strong> 신뢰할 수 있는 프로필과 이에 대한 기술자/기업의 수요 검증</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">핵심 지표(North Star):</strong> 검증 가능한 기술자 프로필 완성 수</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">Aha Moment:</strong> 프로필 완성, 첫 경력 인증, 기업 조회 등 핵심 행동 탐색</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">검증 계획:</strong> 기술자(50명) 및 기업(20개사) 심층 인터뷰 & 행동 데이터 로깅</span>
              </li>
            </ul>
          </div>
        </div>"""

r2_modal = """
    <!-- R2 Strategy Modal -->
    <dialog id="r2-strategy-modal" class="bg-transparent w-full h-full p-0 m-0 fixed inset-0 z-50 backdrop:bg-ink-900/50">
      <div class="fixed inset-0 bg-ink-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onclick="document.getElementById('r2-strategy-modal').close()">
        <div class="bg-warm-50 rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onclick="event.stopPropagation()">
          <button onclick="document.getElementById('r2-strategy-modal').close()" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-warm-100 hover:bg-warm-200 text-ink-900 transition-colors z-10">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
          <div class="p-8 md:p-12 h-full max-h-[85vh] overflow-y-auto">
            <div class="mb-10">
              <div class="h-eyebrow mb-2 text-tech-700">2라운드 준비 전략</div>
              <h2 class="text-3xl md:text-4xl font-black text-ink-900 leading-tight mb-4">
                MVP 검증 및 Product-Market Fit(PMF) 탐색 계획
              </h2>
              <p class="body-lg text-ink-800">
                기능 개발 자체가 아니라 실제 사용자의 행동 데이터를 확보하고, 시장의 문제를 검증하는 데 집중합니다.
              </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="col-span-1 md:col-span-2 bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8">
                <div class="chip bg-warm-100 text-ink-900 border border-ink-900/10 mb-3">1. 핵심 지표(North Star Metric)</div>
                <h3 class="text-2xl font-black text-ink-900 mb-4">검증 가능한 기술자 프로필 완성 수</h3>
                <p class="body-md mb-4">2라운드에서는 허수 가입자 수보다 의미 있는 <strong>행동 데이터 측정</strong>에 집중합니다.</p>
                <p class="body-md">단순 가입이 아니라 실제 경력과 자격 정보를 입력하여 신뢰 프로필을 완성하는 순간을 가장 중요한 가치 창출 시점으로 정의합니다.</p>
              </div>

              <div class="bg-transparent border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
                <div class="h-eyebrow mb-2">2. 검증 가설 및 목표</div>
                <h4 class="text-lg font-bold text-ink-900 mb-3">가설 및 PMF 탐색</h4>
                <ul class="body-md list-disc pl-5 space-y-1 mb-4 text-ink-800">
                  <li>기술자는 신뢰성 있는 경력 관리 플랫폼을 원함</li>
                  <li>기업은 검증 가능한 실제 현장 경험을 선호함</li>
                  <li>데이터가 축적될수록 채용 효율성 및 신뢰도 향상</li>
                  <li>초기 PMF 신호 확보 및 Aha Moment 도출</li>
                </ul>
              </div>

              <div class="bg-transparent border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
                <div class="h-eyebrow mb-2">3. MVP 범위 정의</div>
                <h4 class="text-lg font-bold text-ink-900 mb-3">기능 최소화, 가치 최대화</h4>
                <ul class="body-md list-disc pl-5 space-y-1 text-ink-800">
                  <li><strong>기술자:</strong> 프로필, 경력, 자격증, 기술 등록</li>
                  <li><strong>기업:</strong> 기술자 검색, 프로필 조회, 관심 등록</li>
                  <li><strong>관리자:</strong> 데이터 검증, 인터뷰 관리, 로깅</li>
                </ul>
              </div>

              <div class="bg-transparent border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
                <div class="h-eyebrow mb-2">4. 사용자 검증 계획</div>
                <h4 class="text-lg font-bold text-ink-900 mb-3">기술자 및 기업 고객 인터뷰</h4>
                <div class="space-y-4">
                  <div>
                    <span class="text-sm font-bold text-ink-900 block mb-1">기술자 (목표 50명 이상)</span>
                    <p class="body-md text-ink-800">경력 관리 방식, 구직 문제점, 디지털 프로필 수요</p>
                  </div>
                  <div>
                    <span class="text-sm font-bold text-ink-900 block mb-1">기업 (목표 20개 사 이상)</span>
                    <p class="body-md text-ink-800">채용 프로세스, 기술자 검증, 인력 확보 페인포인트</p>
                  </div>
                </div>
              </div>

              <div class="bg-transparent border border-ink-900/10 p-6 md:p-8 shadow-blueprint">
                <div class="h-eyebrow mb-2">5. 데이터 기반 운영 체계</div>
                <h4 class="text-lg font-bold text-ink-900 mb-3">이벤트 로깅 및 분석</h4>
                <ul class="body-md list-disc pl-5 space-y-1 text-ink-800">
                  <li><strong>측정:</strong> 프로필 생성, 조회, 관심등록, 지원</li>
                  <li><strong>분석:</strong> 가입 전환율, 완성률, 리텐션 추적</li>
                  <li><strong>Aha Moment:</strong> 리텐션 상승의 핵심 행동 도출</li>
                </ul>
              </div>

              <div class="bg-warm-100 border border-ink-900/10 p-6 md:p-8 shadow-blueprint flex flex-col justify-center md:col-span-2">
                <div class="h-eyebrow mb-2">6. 2라운드 지원금 활용 및 최종 목표</div>
                <div class="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 class="text-lg font-bold text-ink-900 mb-2">자금 및 AI 활용 계획</h4>
                    <p class="body-md text-ink-800 mb-2"><strong>사업화 자금:</strong> UI/UX 개선, 데이터 수집 체계 구축, 심층 인터뷰 사례비 등</p>
                    <p class="body-md text-ink-800"><strong>AI 솔루션:</strong> 행동 데이터 분석, 스크립트 요약 자동화</p>
                  </div>
                  <div class="border-t md:border-t-0 md:border-l border-ink-900/10 pt-4 md:pt-0 md:pl-6">
                    <h4 class="text-lg font-bold text-ink-900 mb-2">3라운드 진출을 위한 Next Step</h4>
                    <p class="body-md text-ink-800 mb-1">· 기술자의 자발적 프로필 등록 동기 확보</p>
                    <p class="body-md text-ink-800 mb-1">· 기업의 지불 의사 확인</p>
                    <p class="body-md text-tech-700 font-bold mt-2">→ 검증된 PMF 기반 전국 단위 스케일업 전략 도출</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
"""

for path in files_to_update:
    if not os.path.exists(path):
        print(f"Skipping {path}, not found.")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Insert the summary box at the end of the R2 article
    target_r2_end = '''본 라운드(공개 IR 오디션) 합격 후 3라운드 진출 시 <strong class="text-ink-900">시제품 고도화 비용 최대 1천만 원 추가 지원</strong> + 선배 창업 멘토링</div>
            </div>
          </div>
        </div>
      </article>'''

    if target_r2_end in content and r2_summary not in content:
        content = content.replace(target_r2_end, '''본 라운드(공개 IR 오디션) 합격 후 3라운드 진출 시 <strong class="text-ink-900">시제품 고도화 비용 최대 1천만 원 추가 지원</strong> + 선배 창업 멘토링</div>
            </div>
          </div>
        </div>
''' + r2_summary + '''
      </article>''')
        print(f"Updated R2 summary in {path}")
    
    # 2. Insert the modal near the end of the body (after r1-strategy-modal)
    if 'r2-strategy-modal' not in content:
        if '</body>' in content:
            content = content.replace('</body>', r2_modal + '\n</body>')
            print(f"Added r2-strategy-modal to {path}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
