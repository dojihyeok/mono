import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract Section 04 content
# The section starts with <!-- SECTION 04: 1라운드 운영 전략 -->
# and ends with </section>
sec4_match = re.search(r'<!-- SECTION 04: 1라운드 운영 전략 -->\n\s*<section class="py-16 md:py-24 border-t border-ink-900/10 bg-white">.*?</section>', html, re.DOTALL)

if sec4_match:
    sec4_content = sec4_match.group(0)
    # Remove it from the current location
    html = html.replace(sec4_content, '')
    
    # We will convert this sec4_content into a modal popup.
    modal_html = """
    <!-- R1 Strategy Modal -->
    <dialog id="r1-strategy-modal" class="bg-transparent w-full h-full p-0 m-0 fixed inset-0 z-50 backdrop:bg-ink-900/50">
      <div class="fixed inset-0 bg-ink-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onclick="document.getElementById('r1-strategy-modal').close()">
        <div class="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 relative" onclick="event.stopPropagation()">
          <button onclick="document.getElementById('r1-strategy-modal').close()" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-warm-100 hover:bg-warm-200 text-ink-900 transition-colors z-10">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
          <div class="p-8 md:p-12 h-full max-h-[85vh] overflow-y-auto">
            <div class="mb-10">
              <div class="h-eyebrow mb-2 text-tech-700">1라운드 준비 전략</div>
              <h2 class="text-3xl md:text-4xl font-black text-ink-900 leading-tight mb-4">
                T-Rive 팀의 1라운드(지역예선) 실행 계획 및 성장 전략
              </h2>
              <p class="body-lg text-ink-800">
                완성된 사업계획서 경쟁이 아닌, "가장 빠르게 배우고 성장하는 팀"을 목표로 합니다.
              </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="col-span-1 md:col-span-2 bg-warm-50 border border-ink-900/15 lcorner p-6 md:p-8">
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
        </div>
      </div>
    </dialog>
    """
    
    # 2. Add Modal to the bottom of the body
    html = html.replace('</body>', modal_html + '\n</body>')
    
    # 3. Find the R1 card and add the summary and button
    # R1 card contains "멘토 기관 및 멘토의 관찰&서면 평가"
    # Let's find it.
    r1_target = re.search(r'(<article class="relative bg-warm-50 border border-ink-900/15 lcorner p-5 md:p-6 lg:p-8 shadow-blueprint">.*?)(\n\s*</article>)', html, re.DOTALL)
    if r1_target:
        r1_inner = r1_target.group(1)
        r1_close = r1_target.group(2)
        
        # We need to append the button and summary to the 2/3 column or bottom of the card.
        # Currently the card has:
        # <div class="md:w-2/3 md:pl-6">
        # ...
        # </div>
        # We can add a new section at the bottom of md:w-2/3.
        
        button_html = """
            <div class="mt-6 pt-5 border-t border-ink-900/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-ink-900">- 내용 요약 -</span>
                <button onclick="document.getElementById('r1-strategy-modal').showModal()" class="text-sm font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1 transition-colors">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> 1라운드 준비 전략 - 상세 보기
                </button>
              </div>
              <div class="bg-white p-4 border border-ink-900/10 rounded">
                <ul class="text-sm text-ink-800 space-y-1.5 list-disc pl-4 marker:text-tech-500">
                  <li><strong>핵심 목표:</strong> 완성된 서비스보다 빠르게 배우고 성장하는 과정을 증명</li>
                  <li><strong>멘토링 전략:</strong> 적극적인 피드백 반영 루프 구축 및 실행</li>
                  <li><strong>지원금 활용:</strong> 1R 200만원(MVP 검증) / 2R 진출시 1,000만원(실제 서비스 검증)</li>
                </ul>
              </div>
            </div>"""
        
        # Append button_html inside the 2/3 column before its closing div.
        # Let's just do a string replacement on the last </div> before </article>
        # Actually it's safer to find the inner div ending.
        # Let's locate the last </div> in r1_inner.
        parts = r1_inner.rsplit('</div>', 2)
        if len(parts) >= 3:
            r1_new = parts[0] + '</div>' + button_html + parts[1] + '</div>' + parts[2]
            html = html.replace(r1_target.group(0), r1_new + r1_close)
            print("Successfully updated R1 card with button and summary.")
        else:
            print("Could not parse R1 card structure.")
    else:
        print("Could not find R1 card.")

    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully processed the request.")
else:
    print("Could not find Section 04.")
