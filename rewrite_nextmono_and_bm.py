import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Problem 05 Text
html = html.replace('Tech-Blue 인프라 구축', '현장 맞춤형 Tech-Blue 인프라')

# 2. Add EaaS to Future BM
future_bm_add = """          <div>
            <h4 class="font-bold text-ink-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-toolbox text-tech-600"></i> Equipment as a Service (EaaS)</h4>
            <p class="text-[13px] text-ink-700 leading-relaxed">현장 데이터를 기반으로 최적의 장비와 웨어러블 기술을 제공하는 구독형 산업 인프라 플랫폼</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>"""
html = html.replace('        </div>\n      </div>\n    </div>\n  </div>\n</section>', future_bm_add)

# 3. Rewrite Next MONO section
start_idx = html.find('<div class="section-label mb-4"><span class="num">07</span>')
end_idx = html.find('<!-- Task 4: Tech-Blue Modular Robotics Simulator -->', start_idx)

new_next_mono = """<div class="section-label mb-4"><span class="num">07</span> Next MONO : 현장 맞춤형 Tech-Blue 인프라</div>
      <h2 class="h-display text-ink-900" style="word-break:keep-all;">현장 데이터 기반 장비·웨어러블 로보틱스 전략</h2>
      <div class="mt-6 p-6 md:p-8 bg-warm-50 border border-ink-900/15 lcorner shadow-sm">
        <p class="body-lg text-ink-900 font-bold mb-4">"MONO는 현장에서 축적되는 작업 데이터와 안전 데이터를 기반으로 기술자와 기업에 가장 적합한 장비와 미래 기술을 연결합니다."</p>
        <p class="body-md text-ink-700 leading-relaxed" style="word-break: keep-all;">
          반복 작업, 중량물 작업, 고위험 작업에 대해서는 웨어러블 로봇(착용형 로봇)과 스마트 장비를 활용하여 기술자의 신체 부담을 줄이고 생산성과 안전성을 높일 수 있도록 지원합니다.<br />
          <strong class="text-ink-900">기술자는 더 오래 건강하게 일할 수 있으며, 기업은 숙련 인력의 생산성을 높일 수 있습니다.</strong>
        </p>
      </div>

      <!-- 5단계 발전 방향 -->
      <div class="mt-12 mb-16">
        <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-6 border-b border-ink-900/10 pb-3" style="word-break:keep-all;">
          데이터에서 로보틱스까지, 5단계 진화 로드맵
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- 1단계 -->
          <div class="bg-warm-100 border border-ink-900/15 lcorner p-5 hover-lift relative shadow-sm">
            <div class="text-ink-500 font-mono font-bold text-xs mb-2 tracking-wider">STEP 01</div>
            <h4 class="text-base font-black text-ink-900 mb-3">현장 데이터 수집</h4>
            <ul class="list-none space-y-2 text-[13px] text-ink-700 font-bold">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 작업 이력</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 안전 이력</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 장비 사용 이력</li>
            </ul>
          </div>
          <!-- 2단계 -->
          <div class="bg-warm-100 border border-ink-900/15 lcorner p-5 hover-lift relative shadow-sm">
            <div class="text-ink-500 font-mono font-bold text-xs mb-2 tracking-wider">STEP 02</div>
            <h4 class="text-base font-black text-ink-900 mb-3">현장 분석</h4>
            <ul class="list-none space-y-2 text-[13px] text-ink-700 font-bold">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 반복 작업 분석</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 위험 작업 분석</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 생산성 분석</li>
            </ul>
          </div>
          <!-- 3단계 -->
          <div class="bg-warm-100 border border-ink-900/15 lcorner p-5 hover-lift relative shadow-sm">
            <div class="text-ink-500 font-mono font-bold text-xs mb-2 tracking-wider">STEP 03</div>
            <h4 class="text-base font-black text-ink-900 mb-3">맞춤형 장비 추천</h4>
            <ul class="list-none space-y-2 text-[13px] text-ink-700 font-bold">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 공구</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 안전장비</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 스마트 작업장비</li>
            </ul>
          </div>
          <!-- 4단계 -->
          <div class="bg-warm-100 border border-ink-900/15 lcorner p-5 hover-lift relative shadow-sm">
            <div class="text-ink-500 font-mono font-bold text-xs mb-2 tracking-wider">STEP 04</div>
            <h4 class="text-base font-black text-ink-900 mb-3">웨어러블 로봇 지원</h4>
            <ul class="list-none space-y-2 text-[13px] text-ink-700 font-bold">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 근력 보조</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 허리 부담 감소</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-tech-600 text-[10px]"></i> 중량물 작업 지원</li>
            </ul>
          </div>
          <!-- 5단계 -->
          <div class="bg-warm-200 border border-ink-900/15 lcorner p-5 hover-lift relative shadow-md">
            <div class="text-ink-900 font-mono font-black text-xs mb-2 tracking-wider">STEP 05 (Next MONO)</div>
            <h4 class="text-base font-black text-ink-900 mb-3">협업 로봇 및 Tech-Blue</h4>
            <ul class="list-none space-y-2 text-[13px] text-ink-800 font-black">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-ink-900 text-[10px]"></i> 인간과 로봇 협업</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-ink-900 text-[10px]"></i> AI 기반 현장 운영</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-ink-900 text-[10px]"></i> 디지털 기술자 생태계</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    """
    
if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + new_next_mono + html[end_idx:]

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
