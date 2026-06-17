import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. & 6. Core Definitions and Vision
html = html.replace('기술자의 경험이 자산이 되고, 근무기록이 신뢰가 되는 스마트 현장 플랫폼', '기술자의 경험을 자산으로 만들고, 산업 현장의 데이터를 미래 기술 혁신으로 연결하는 스마트 현장 플랫폼')

# Vision 1
html = html.replace('우리는 기술자의 경험이 개인의 경력을 넘어 대한민국 산업의 자산이 되는 세상을 만들고자 합니다.', '기술자의 경험과 산업 현장의 데이터가 대한민국 산업의 미래 경쟁력으로 이어질 수 있도록 연결합니다.')
html = html.replace('기술자의 경험과 숙련이 사라지지 않고 다음 세대로 이어질 수 있도록 기록하고 연결합니다. <br>그리고 그 경험이 더 좋은 일자리, 성장 기회, 금융 혜택, 글로벌 기회, 미래 기술의 기반이 되는 생태계를 만들어 갑니다.', 'MONO는 기술자의 경험을 자산으로 만드는 플랫폼입니다. 그리고 그 경험을 산업 현장 데이터로 연결하여 더 나은 일자리, 금융, 성장 기회는 물론 미래 산업 기술 혁신의 기반을 구축합니다.')


# 2. Industry Data & 3. Evolution Flow
# I will replace the entire Section 07 (which starts around line 1923: <div class="section-label mb-4"><span class="num">07</span> Next MONO)
# Wait, let's locate the section to replace: 
evolution_target = re.search(r'<div class="section-label mb-4"><span class="num">07</span> Next MONO : 현장 맞춤형 Tech-Blue 인프라</div>.*?<!-- Bottom Row \(Steps 5-7\) -->.*?</div>\s*</div>', html, re.DOTALL)

if evolution_target:
    new_evolution_html = """<div class="section-label mb-4"><span class="num">07</span> Next MONO : 산업 데이터 기반 미래 기술 플랫폼</div>
      
      <!-- 2. 산업 데이터 관점 추가 -->
      <div class="bg-white border border-ink-900/10 p-8 rounded-lg mb-12 shadow-sm">
        <h3 class="text-2xl font-black text-ink-900 mb-4">왜 현장 데이터가 중요한가?</h3>
        <p class="body-lg text-ink-800 mb-6 leading-relaxed">
          대한민국 산업 현장에는 수많은 경험과 노하우가 존재합니다. 하지만 현재는 <strong>어떤 작업이 어려운지, 어떤 장비가 불편한지, 어떤 공정에서 사고가 발생하는지, 어떤 기술이 부족한지</strong>에 대한 데이터가 체계적으로 축적되지 않고 있습니다.
        </p>
        <p class="body-lg text-ink-800 font-bold">
          MONO는 기술자의 경험과 현장 정보를 연결하여 산업 현장의 문제를 데이터로 이해할 수 있는 기반을 구축합니다.
        </p>
      </div>

      <!-- 4. Next MONO 설명 보완 -->
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight mb-4">현장을 가장 잘 이해하는 플랫폼은 현장에 필요한 기술도 가장 잘 이해합니다.</h2>
      <p class="body-lg text-ink-800 font-bold max-w-4xl leading-relaxed mb-12" style="word-break: keep-all;">
        MONO는 축적된 산업 데이터를 기반으로 웨어러블 로봇, 협업 로봇, 스마트 공구, 안전 장비, 산업 AI 등 미래 산업 기술을 연결하는 플랫폼으로 발전합니다.
      </p>

      <!-- 3. MONO Evolution 흐름도 개선 -->
      <div class="mb-10">
        <h3 class="text-2xl font-black text-ink-900 mb-3">MONO Evolution</h3>
        <p class="body-lg text-ink-800 leading-relaxed max-w-3xl">
          MONO는 기술자의 경험을 기록하는 것에서 시작합니다. 그리고 축적된 데이터를 통해 산업 현장의 문제를 이해하고, 그 문제를 해결할 수 있는 미래 기술을 연결합니다.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 01</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">기술자 경험</h3>
          <p class="text-sm text-ink-800">현장의 기록과 노하우</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 02</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">경력 및 신뢰 데이터</h3>
          <p class="text-sm text-ink-800">대안 신용과 검증된 이력</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 03</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">산업 현장 데이터</h3>
          <p class="text-sm text-ink-800">문제점과 필요 기술 식별</p>
        </article>
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 04</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">산업 인사이트</h3>
          <p class="text-sm text-ink-800">데이터 기반 현장 솔루션</p>
        </article>
      </div>
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <article class="bg-warm-50 border border-ink-900/15 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 05</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">미래 기술 연결</h3>
          <p class="text-sm text-ink-800">현장 맞춤형 기술 매칭</p>
        </article>
        <article class="bg-warm-100 border border-tech-500/50 shadow-sm p-6 rounded-lg">
          <div class="text-tech-600 font-mono font-bold text-sm mb-2">STEP 06</div>
          <h3 class="text-xl font-black text-ink-900 mb-2">웨어러블·협업 로봇·전문 장비</h3>
          <p class="text-sm text-ink-800">Tech-Blue 인프라 구축</p>
        </article>
        <article class="bg-tech-900 text-white shadow-sm p-6 rounded-lg">
          <div class="text-tech-400 font-mono font-bold text-sm mb-2">STEP 07</div>
          <h3 class="text-xl font-black mb-2">산업 혁신</h3>
          <p class="text-sm text-warm-100">대한민국 산업 경쟁력 강화</p>
        </article>
      </div>

      <!-- 5. 전문몰(Marketplace) 전략 추가 -->
      <div class="bg-white border border-ink-900/10 p-8 rounded-lg shadow-sm border-t-4 border-t-tech-600 mb-16">
        <h3 class="text-2xl font-black text-ink-900 mb-4">MONO Tech Marketplace</h3>
        <p class="body-lg text-ink-800 mb-6">
          MONO는 현장에서 필요한 제품과 서비스를 연결하는 전문 산업 플랫폼을 구축합니다.
        </p>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <span class="text-sm font-bold text-tech-600 block mb-2">제공 영역</span>
            <ul class="body-md list-disc pl-5 space-y-1 text-ink-800">
              <li>작업복 및 안전 장비</li>
              <li>전문 공구 및 중장비</li>
              <li>웨어러블 로봇 및 협업 로봇</li>
              <li>현장 AI 솔루션</li>
            </ul>
          </div>
          <div class="bg-warm-50 p-6 rounded border border-ink-900/10">
            <span class="text-sm font-bold text-ink-900 block mb-2">차별성</span>
            <p class="body-md text-ink-800 leading-relaxed">
              일반 쇼핑몰이 아니라, <strong>실제 현장 데이터와 사용 경험을 기반</strong>으로 필요한 제품을 추천하고 연결하는 산업 전문 플랫폼을 지향합니다.
            </p>
          </div>
        </div>
      </div>

      <!-- 7. 최종 핵심 메시지 -->
      <div class="text-center py-12 border-t border-ink-900/10">
        <h2 class="text-2xl md:text-3xl font-black text-ink-900 leading-tight">
          "MONO는 기술자의 경험과 산업 현장 데이터를 연결하여<br class="hidden md:block"/>미래 산업 기술 혁신을 만들어가는 플랫폼입니다."
        </h2>
      </div>
    </div>
"""
    html = html.replace(evolution_target.group(0), new_evolution_html)
    print("Replaced Evolution section.")
else:
    print("Could not find Evolution section.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
