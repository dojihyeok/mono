import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new content
new_content = """    <!-- 트랙 헤더 1 -->
    <div class="reveal mb-6 flex items-end justify-between gap-6 flex-wrap">
      <div class="flex items-center gap-3">
        <span class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm">Track 1 · 아이디어 심사 → 4R</span>
        <h3 class="h-section text-ink-900">모두의 창업 라운드별 전략.</h3>
      </div>
    </div>

    <div class="vtimeline pl-16 lg:pl-20 space-y-8 reveal">
      <!-- 아이디어 심사 -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5">
            <div class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm mb-3">아이디어 심사 (신속/정규)</div>
            <div class="mono text-[11.5px] text-ink-500 mb-2">서면평가</div>
            <h3 class="h-section text-ink-900">우수 창업자 조기 확보 및 종합 평가.</h3>
            <p class="body-md mt-3">신속 심사는 26년 4월 말 선발 결과 공지 예정으로, 우수 창업자를 조기에 확보하기 위해 도전신청서를 평가합니다. 정규 심사는 책임멘토가 차별성, 효과성 등을 종합적으로 판단하여 1R 진출자를 가려냅니다.</p>
          </div>
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4 mb-5">
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">평가 방식</div>
                <div class="num-display text-2xl font-extrabold text-ink-900">서면평가</div>
                <div class="body-sm">신속/정규 분할 접수</div>
              </div>
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">진출 규모</div>
                <div class="num-display text-3xl md:text-[32px] font-extrabold text-ink-900">도전자 전원 → 4,000</div>
                <div class="body-sm">1R 지역 예선 진출</div>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="h-eyebrow mb-2">핵심 실행 전략</div>
                <ul class="body-md list-disc pl-5 space-y-1">
                  <li>신속 심사 조기 접수를 통한 선발 우위 선점</li>
                  <li>문제 정의 및 해결책(차별성·효과성) 명확화</li>
                </ul>
              </div>
              <div>
                <div class="h-eyebrow mb-2">레버리지</div>
                <p class="body-md">에스크로 자금 구조와 중대재해처벌법 대응이라는 명확한 차별성을 전면에 내세워 정규/신속 트랙 모두 최고점을 확보합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 1R -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5">
            <div class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm mb-3">1R · 지역 예선</div>
            <div class="mono text-[11.5px] text-ink-500 mb-2">관찰 및 서면평가</div>
            <h3 class="h-section text-ink-900">성실한 도전자의 일지.</h3>
            <p class="body-md mt-3">프로그램 참여 과정 전반에 기반한 관찰 및 서면평가. 멘토별 최우수 1인 추천(관찰식)과 활동 결과물(서면)을 합산하여 2R 진출자를 선발합니다. 가장 부지런한 도전자로 각인되는 단계입니다.</p>
          </div>
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4 mb-5">
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">평가 방식</div>
                <div class="num-display text-2xl font-extrabold text-ink-900">관찰 + 서면</div>
                <div class="body-sm">활동 결과물 기반</div>
              </div>
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">진출 규모</div>
                <div class="num-display text-3xl md:text-[32px] font-extrabold text-ink-900">4,000 → 500</div>
                <div class="body-sm">2R 지역별 오디션 진출</div>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="h-eyebrow mb-2">핵심 실행 전략</div>
                <ul class="body-md list-disc pl-5 space-y-1">
                  <li>평택·화성 인력대기소 심층 인터뷰 결과물 적시 제출</li>
                  <li>책임멘토 관찰평가 시 최우수 1인 추천 확보</li>
                  <li>주간 보고서 마감 24시간 전 선제 제출</li>
                </ul>
              </div>
              <div>
                <div class="h-eyebrow mb-2">규제 레버리지</div>
                <p class="body-md">중소벤처기업부 「원스톱 자문단」을 선제 가동해 법적 리스크를 먼저 지운 도전자 구도를 완성, 관찰평가 만점을 유도합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 2R -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5">
            <div class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm mb-3">2R · 지역별 오디션</div>
            <div class="mono text-[11.5px] text-ink-500 mb-2">공개 IR</div>
            <h3 class="h-section text-ink-900">작동하는 연결의 첫 공개 증명.</h3>
            <p class="body-md mt-3">17개 시·도별 지역창업 페스티벌과 연계된 공개 IR 단계. 시제품(MVP) 제작 결과와 고도화된 사업계획을 바탕으로 대중과 심사단 앞에서 실시간 매칭을 직접 시연합니다.</p>
          </div>
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4 mb-5">
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">평가 방식</div>
                <div class="num-display text-2xl font-extrabold text-ink-900">공개 IR</div>
                <div class="body-sm">시제품 및 사업계획 발표</div>
              </div>
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">진출 규모</div>
                <div class="num-display text-3xl md:text-[32px] font-extrabold text-ink-900">500 → 200</div>
                <div class="body-sm">3R 권역별 오디션 진출</div>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="h-eyebrow mb-2">핵심 실행 전략</div>
                <ul class="body-md list-disc pl-5 space-y-1">
                  <li>인력 사무소장 연계 실시간 매칭 현장 라이브 시연</li>
                  <li>안전/컴플라이언스 대시보드(SI 데모) 공개</li>
                </ul>
              </div>
              <div>
                <div class="h-eyebrow mb-2">상생 레버리지</div>
                <p class="body-md">인력사무소를 적이 아니라 파트너로 만든 사회적 합의 모델을 공개 IR에서 강조하여, 심사역들의 압도적인 공감을 얻어냅니다.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 3R -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5">
            <div class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm mb-3">3R · 권역별 오디션</div>
            <div class="mono text-[11.5px] text-ink-500 mb-2">Private IR</div>
            <h3 class="h-section text-ink-900">전문 투자자 앞 자본 효율 증명.</h3>
            <p class="body-md mt-3">기술분야별 전문 투자자(VC, FI) 대상 비공개 Private IR. 전 과정의 성과를 종합하여 TOP 100을 선발하는 자리입니다. 초기 자본금 제로 모델 등 압도적인 자본 효율성(ROI)을 증명합니다.</p>
          </div>
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4 mb-5">
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">평가 방식</div>
                <div class="num-display text-2xl font-extrabold text-ink-900">Private IR</div>
                <div class="body-sm">전문 투자자 대상 비공개</div>
              </div>
              <div class="bg-warm-100/60 border border-ink-900/10 p-4">
                <div class="h-eyebrow mb-1">진출 규모</div>
                <div class="num-display text-3xl md:text-[32px] font-extrabold text-ink-900">200 → 100</div>
                <div class="body-sm">4R 전국 오디션 진출 (TOP 100)</div>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="h-eyebrow mb-2">핵심 실행 전략</div>
                <ul class="body-md list-disc pl-5 space-y-1">
                  <li>장기 로봇 수익 공유 구조(초기 투자 절감) 공개</li>
                  <li>이종창업 법적 불확실성 해소 완벽 소명</li>
                </ul>
              </div>
              <div>
                <div class="h-eyebrow mb-2">자본 레버리지</div>
                <p class="body-md">동일한 운영 자본으로 더 넓은 시장을 가볍고 빠르게 장악할 수 있다는 사실이 입증되며, ‘재무 안정성과 스케일업 파워를 갖춘 스타트업’으로 각인됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 4R -->
      <article class="relative bg-warm-100/50 border border-ink-900/15 lcorner p-6 lg:p-8 shadow-blueprint">
        <div class="grid lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5">
            <div class="chip bg-tech-50 text-tech-800 border border-tech-700/35 font-bold shadow-sm mb-3">4R · 전국 오디션</div>
            <div class="mono text-[11.5px] text-ink-500 mb-2">대국민 IR</div>
            <h3 class="h-section text-ink-900">감동 서사 × 첨단 기술의 피날레.</h3>
            <p class="body-md text-ink-700 mt-3">대규모 스타트업 행사(Come-Up 등)와 연계된 최종 단계. 대국민 투표 및 전문가 평가를 합산해 최종 5팀(우승자)을 선정합니다. Next MONO 상생 비전과 외국인 비자 규제 샌드박스를 공식 제안합니다.</p>
          </div>
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4 mb-5">
              <div class="bg-warm-50 border border-ink-900/15 p-4">
                <div class="h-eyebrow text-ink-700 mb-1">평가 방식</div>
                <div class="num-display text-2xl font-extrabold text-ink-900">대국민 IR</div>
                <div class="body-sm text-ink-700">대국민 + 전문가 투표</div>
              </div>
              <div class="bg-warm-50 border border-ink-900/15 p-4">
                <div class="h-eyebrow text-ink-700 mb-1">최종 진출</div>
                <div class="num-display text-3xl md:text-[32px] font-extrabold text-ink-900 font-bold">100 → 5</div>
                <div class="body-sm text-ink-700">최종 우승팀 선정</div>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="h-eyebrow text-tech-700 mb-2">대국민 액션</div>
                <ul class="body-md text-ink-700 list-disc pl-5 space-y-1">
                  <li>Next MONO 상생 비전 선포 · 청년 자립 캠페인</li>
                  <li>외국인 비자 규제 샌드박스 1호 공개</li>
                </ul>
              </div>
              <div>
                <div class="h-eyebrow text-tech-700 mb-2">우승 레버리지</div>
                <p class="body-md text-ink-700">감동 서사(청년·은퇴 세대)와 첨단 기술(로보틱스)을 같은 무대 위에 올림. 대중과 심사위원이 동시에 ‘이 팀이어야 한다’고 느끼게 만드는 1위 시나리오.</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>"""

# Replace between the start pattern and the end pattern
start_pattern = r'<!-- 트랙 헤더 1 -->.*?<div class="vtimeline pl-16 lg:pl-20 space-y-8 reveal">'
end_pattern = r'<!-- 트랙 헤더 2 -->'

# Use regex with re.DOTALL to match across newlines
match = re.search(f'({start_pattern}.*?)(?={end_pattern})', content, flags=re.DOTALL)
if match:
    updated_content = content[:match.start()] + new_content + "\n\n    " + content[match.end():]
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("SUCCESS: Replaced Track 1 content.")
else:
    print("ERROR: Could not find the Track 1 block to replace.")
