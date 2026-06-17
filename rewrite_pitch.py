import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Section 06 "우리의 약속"
old_sec06_box = """        <h3 class="text-xl md:text-3xl font-extrabold text-ink-900 leading-snug tracking-tight mb-4" style="word-break: keep-all; ">
          &#8220;사람과 AI가 함께 성장하는 시대, 기술자의 경험은 더 큰 가치가 됩니다., <span class="text-cyber-glow font-extrabold">기술자의 땀방울과 경험이 가장 가치 있는 자산으로 인정받는</span> 세상&#8221;
        </h3>
        <div class="w-16 h-[2px] bg-gradient-to-r from-tech-400 to-tech-600 mx-auto mb-5 group-hover:w-24 transition-all duration-500"></div>
        <p class="body-lg text-ink-700 w-full" style="word-break: keep-all; ">
          MONO는 숙련 기술자의 경험과 현장 데이터를 기반으로 AI와 협업 로봇이 더 안전하고 효율적으로 일할 수 있도록 지원합니다. 위험하고 반복적인 작업은 기술이 돕고, 기술자는 더 안전하게 더 높은 가치의 일에 집중합니다. 축적된 생산성의 성과는 기술자와 함께 공유되며, MONO는 미래 인재 육성과 상생 기술노동 산업 인프라를 만들어갑니다.
        </p>"""

# Need to handle the fact that I previously updated the `p` tag with hidden md:block!
# So I will just use regex to replace from <h3 class="text-xl md:text-3xl font-extrabold text-ink-900 leading-snug to the end of the p tags.
import re

pattern_sec06 = re.compile(
    r'(<h3 class="text-xl md:text-3xl font-extrabold text-ink-900 leading-snug tracking-tight mb-4"[^>]*>).*?(</div>\s*<p class="hidden md:block[^>]*>).*?(</p>\s*<!-- Mobile Only -->\s*<p class="block md:hidden[^>]*>).*?(</p>)',
    re.DOTALL
)

match = pattern_sec06.search(html)
if match:
    new_sec06_box = f"""{match.group(1)}
          &#8220;<span class="text-cyber-glow font-extrabold">대한민국 산업 경쟁력의 시작은 기술자입니다.</span>&#8221;
        </h3>
        <div class="w-16 h-[2px] bg-gradient-to-r from-tech-400 to-tech-600 mx-auto mb-5 group-hover:w-24 transition-all duration-500"></div>
        <p class="hidden md:block body-lg text-ink-700 w-full" style="word-break: keep-all; ">
          MONO는 기술자의 경험과 숙련이 사라지지 않고 다음 세대로 이어질 수 있도록 기록하고 연결합니다. <br>그리고 그 경험이 더 좋은 일자리, 성장 기회, 금융 혜택, 글로벌 기회, 미래 기술의 기반이 되는 생태계를 만들어 갑니다.
        </p>
        <!-- Mobile Only -->
        <p class="block md:hidden text-[15px] leading-snug text-ink-700 w-full tracking-tight" style="word-break: keep-all; ">
          기술자의 경험과 숙련이 다음 세대로 이어지도록 기록하고 연결하여, 더 나은 기회와 미래 기술의 기반이 되는 생태계를 만듭니다.
        </p>"""
    html = html[:match.start()] + new_sec06_box + html[match.end():]
else:
    print("WARNING: Could not find sec06 box to replace.")


# 2. Update Section 07 Next MONO entirely.
# Let's find the start and end of section 07.
start_idx = html.find('<section id="vision"')
# Find the next section or footer
end_idx = html.find('<div class="mt-24 mb-10 w-full mx-auto reveal text-center">', start_idx)

new_sec07 = """<section id="vision" class="relative py-24 lg:py-32 bg-ink-900 text-warm-50 overflow-hidden">
  <div class="absolute inset-0 blueprint opacity-20 pointer-events-none mix-blend-overlay"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 opacity-90 pointer-events-none"></div>
  
  <div class="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
    <div class="max-w-4xl mx-auto text-center mb-16 reveal">
      <div class="section-label mb-4"><span class="num">07</span> Next MONO : 현장 맞춤형 Tech-Blue 인프라</div>
      <h2 class="h-display text-white leading-tight tracking-tight mb-6" style="word-break: keep-all;">
        기술자의 경험은 사라져야 할 노동이 아니라,<br class="hidden md:block" />
        <span class="text-tech-400">다음 세대 산업을 움직이는 자산</span>입니다.
      </h2>
      <p class="body-lg text-warm-200" style="word-break: keep-all;">
        MONO는 기술자의 경험과 숙련을 기록하고 연결하여 더 안전한 현장, 더 나은 성장 기회, 그리고 대한민국 산업 경쟁력의 미래를 만들어 갑니다.
      </p>
      <!-- Evolution diagram image from previous step -->
      <div class="mt-8 relative w-full rounded-lg overflow-hidden border border-warm-200/20 shadow-2xl">
        <img src="images/next_mono_evolution.jpg" alt="NEXT MONO EVOLUTION" class="w-full h-auto object-cover" />
      </div>
    </div>

    <!-- 7-Step Evolution Roadmap -->
    <div class="relative max-w-6xl mx-auto reveal">
      
      <!-- Top Row (Steps 1-4) -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        <!-- STEP 01 -->
        <article class="bg-ink-800/80 border border-warm-200/10 p-6 rounded-lg hover:border-tech-500/50 transition-colors relative group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-clipboard-list text-4xl"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 01</div>
          <h3 class="text-xl font-black text-white mb-4">기술자 경험 기록</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 근무 이력</li>
            <li>· 기술 경력</li>
            <li>· 교육 이력</li>
            <li>· 안전 이력</li>
            <li>· 장비 사용 이력</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-warm-200/20 to-transparent my-4"></div>
          <p class="text-sm text-warm-100 leading-relaxed" style="word-break:keep-all;">기술자의 경험과 숙련을 디지털 자산으로 기록</p>
        </article>

        <!-- STEP 02 -->
        <article class="bg-ink-800/80 border border-warm-200/10 p-6 rounded-lg hover:border-tech-500/50 transition-colors relative group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-database text-4xl"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 02</div>
          <h3 class="text-xl font-black text-white mb-4">기술 경험 자산화</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 숙련도 분석</li>
            <li>· 경력 인증</li>
            <li>· 기술 포트폴리오</li>
            <li>· 작업 패턴 분석</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-warm-200/20 to-transparent my-4"></div>
          <p class="text-sm text-warm-100 leading-relaxed" style="word-break:keep-all;">사라지는 경험을 산업 자산으로 전환</p>
        </article>

        <!-- STEP 03 -->
        <article class="bg-ink-800/80 border border-warm-200/10 p-6 rounded-lg hover:border-tech-500/50 transition-colors relative group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-chart-line text-4xl"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 03</div>
          <h3 class="text-xl font-black text-white mb-4">현장 최적화 분석</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 반복 작업 분석</li>
            <li>· 위험 작업 분석</li>
            <li>· 생산성 분석</li>
            <li>· 작업 환경 분석</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-warm-200/20 to-transparent my-4"></div>
          <p class="text-sm text-warm-100 leading-relaxed" style="word-break:keep-all;">현장 데이터를 기반으로 작업 환경 개선</p>
        </article>

        <!-- STEP 04 -->
        <article class="bg-ink-800/80 border border-tech-500/30 p-6 rounded-lg hover:border-tech-400 transition-colors relative group shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-vr-cardboard text-4xl text-tech-400"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest flex items-center justify-between">
            STEP 04
            <span class="text-[10px] bg-tech-900/50 text-tech-400 px-2 py-0.5 rounded border border-tech-500/30">조선·건설·플랜트·방산</span>
          </div>
          <h3 class="text-xl font-black text-white mb-4">맞춤 장비 & 웨어러블</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 스마트 공구</li>
            <li>· 스마트 안전장비</li>
            <li>· 착용형 보조장치</li>
            <li>· 웨어러블 로봇</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-tech-500/50 to-transparent my-4"></div>
          <p class="text-sm text-tech-100 leading-relaxed" style="word-break:keep-all;">기술자의 신체 부담을 줄이고 생산성과 안전성을 향상</p>
        </article>
      </div>

      <!-- Bottom Row (Steps 5-7) -->
      <div class="grid md:grid-cols-3 gap-6">
        
        <!-- STEP 05 -->
        <article class="bg-ink-800/80 border border-warm-200/10 p-6 rounded-lg hover:border-tech-500/50 transition-colors relative group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-user-astronaut text-4xl"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 05</div>
          <h3 class="text-xl font-black text-white mb-4">Tech-Blue</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 디지털 기술자</li>
            <li>· AI 협업</li>
            <li>· 스마트 현장 운영</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-warm-200/20 to-transparent my-4"></div>
          <p class="text-sm text-warm-100 leading-relaxed" style="word-break:keep-all;">사람과 기술이 함께 성장하는 미래 기술자 모델</p>
        </article>

        <!-- STEP 06 -->
        <article class="bg-ink-800/80 border border-warm-200/10 p-6 rounded-lg hover:border-tech-500/50 transition-colors relative group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-robot text-4xl"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 06</div>
          <h3 class="text-xl font-black text-white mb-4">협업 로봇(Cobot)</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-200/80 font-mono">
            <li>· 용접 보조</li>
            <li>· 도장 보조</li>
            <li>· 검사 보조</li>
            <li>· 물류 보조</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-warm-200/20 to-transparent my-4"></div>
          <p class="text-sm text-warm-100 leading-relaxed" style="word-break:keep-all;">위험 작업은 로봇이 보조하고 기술자는 고부가가치 업무에 집중</p>
        </article>

        <!-- STEP 07 -->
        <article class="bg-gradient-to-br from-ink-800 to-tech-900/40 border border-tech-500/50 p-6 rounded-lg hover:border-tech-400 transition-colors relative group shadow-[0_0_25px_rgba(34,211,238,0.15)]">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><i class="fa-solid fa-city text-4xl text-tech-400"></i></div>
          <div class="text-tech-400 font-mono font-bold text-sm mb-2 tracking-widest">STEP 07</div>
          <h3 class="text-xl font-black text-white mb-4">MONO 산업 인프라 플랫폼</h3>
          <ul class="space-y-1 mb-4 text-sm text-warm-100 font-mono grid grid-cols-2 gap-x-2">
            <li>· 일자리</li>
            <li>· 금융</li>
            <li>· 교육</li>
            <li>· 복지</li>
            <li>· 글로벌 인력</li>
            <li class="col-span-2 mt-1 pt-1 border-t border-tech-500/30 text-tech-300">· 장비 구독(EaaS)</li>
            <li class="col-span-2 text-tech-300">· 로보틱스 서비스(RaaS)</li>
          </ul>
          <div class="h-px w-full bg-gradient-to-r from-tech-500/50 to-transparent my-4"></div>
          <p class="text-sm text-tech-100 leading-relaxed font-bold" style="word-break:keep-all;">기술자의 경험을 산업의 자산으로 연결하는 통합 플랫폼</p>
        </article>
      </div>

    </div>

    <!-- EaaS Section (Equipment as a Service) -->
    <div class="max-w-4xl mx-auto mt-20 p-8 md:p-10 bg-warm-50 rounded-lg text-ink-900 shadow-xl reveal relative overflow-hidden border border-warm-200">
      <div class="absolute top-0 left-0 w-2 h-full bg-tech-500"></div>
      <div class="flex items-center gap-3 mb-4">
        <i class="fa-solid fa-toolbox text-2xl text-tech-600"></i>
        <h3 class="text-2xl font-black tracking-tight">Equipment as a Service</h3>
      </div>
      <p class="text-lg md:text-xl font-semibold leading-relaxed mb-6" style="word-break:keep-all;">
        현장 데이터를 기반으로 기술자와 기업에 가장 적합한 장비와 웨어러블 솔루션을 제공합니다.
      </p>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h4 class="text-sm font-bold text-ink-500 mb-2 uppercase tracking-wider">확장 로드맵</h4>
          <p class="text-base text-ink-800 leading-relaxed" style="word-break:keep-all;">초기에는 공구와 안전장비부터 시작하여, 장기적으로는 웨어러블 로봇과 협업 로봇까지 확대합니다.</p>
        </div>
        <div>
          <h4 class="text-sm font-bold text-ink-500 mb-2 uppercase tracking-wider">상생 가치</h4>
          <p class="text-base text-ink-800 leading-relaxed" style="word-break:keep-all;">기술자는 초기 투자 부담 없이 최신 장비를 활용할 수 있으며, 기업은 생산성과 안전성을 동시에 향상시킬 수 있습니다.</p>
        </div>
      </div>
    </div>
    
  """

html = html[:start_idx] + new_sec07 + html[end_idx:]

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated Next MONO Section 07 and Promise in Section 06.")
