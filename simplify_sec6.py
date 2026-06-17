import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. First long paragraph
target1 = '<p class="body-lg mt-5" style="font-size: 1.2rem; line-height: 1.75;">MONO는 현장에 남은 낡은 관행을 지우고, 사람의 근무이력·데이터·기술로 새로운 ‘미래 기술 장인(Tech-Blue)’과 함께 상생하고 성장하는 스마트 일자리 플랫폼입니다. 청년·워홀러·노마드·외국인·은퇴자 다섯 세대의 삶을 같은 데이터 신뢰 경제권 위에서 끌어안고, 그들의 사회적 인식과 가치를 수직 상승시키는 라이프 사이클 브랜드.</p>'

replacement1 = """<p class="hidden md:block body-lg mt-5" style="font-size: 1.2rem; line-height: 1.75;">MONO는 현장에 남은 낡은 관행을 지우고, 사람의 근무이력·데이터·기술로 새로운 ‘미래 기술 장인(Tech-Blue)’과 함께 상생하고 성장하는 스마트 일자리 플랫폼입니다. 청년·워홀러·노마드·외국인·은퇴자 다섯 세대의 삶을 같은 데이터 신뢰 경제권 위에서 끌어안고, 그들의 사회적 인식과 가치를 수직 상승시키는 라이프 사이클 브랜드.</p>
      <!-- Mobile Only -->
      <p class="block md:hidden mt-5 text-[15px] leading-snug text-ink-800 tracking-tight" style="word-break:keep-all;">
        근무 이력과 데이터를 기반으로 새로운 기술 장인(Tech-Blue)과 함께 성장하는 플랫폼입니다. 전 세대 기술자의 사회적 인식과 가치를 높입니다.
      </p>"""

if target1 in html:
    html = html.replace(target1, replacement1)

# 2. Second long paragraph in hyper-glow-box
target2 = """<p class="body-lg text-ink-700 w-full" style="word-break: keep-all; ">
          MONO는 숙련 기술자의 경험과 현장 데이터를 기반으로 AI와 협업 로봇이 더 안전하고 효율적으로 일할 수 있도록 지원합니다. 위험하고 반복적인 작업은 기술이 돕고, 기술자는 더 안전하게 더 높은 가치의 일에 집중합니다. 축적된 생산성의 성과는 기술자와 함께 공유되며, MONO는 미래 인재 육성과 상생 기술노동 산업 인프라를 완성합니다.
        </p>"""

replacement2 = """<p class="hidden md:block body-lg text-ink-700 w-full" style="word-break: keep-all; ">
          MONO는 숙련 기술자의 경험과 현장 데이터를 기반으로 AI와 협업 로봇이 더 안전하고 효율적으로 일할 수 있도록 지원합니다. 위험하고 반복적인 작업은 기술이 돕고, 기술자는 더 안전하게 더 높은 가치의 일에 집중합니다. 축적된 생산성의 성과는 기술자와 함께 공유되며, MONO는 미래 인재 육성과 상생 기술노동 산업 인프라를 완성합니다.
        </p>
        <!-- Mobile Only -->
        <p class="block md:hidden text-[14px] leading-snug text-ink-700 w-full tracking-tight" style="word-break: keep-all; ">
          위험하고 반복적인 작업은 AI와 로봇이 돕고, 기술자는 높은 가치의 일에 집중합니다. 현장 경험이 최고의 자산이 되는 상생 인프라를 만듭니다.
        </p>"""

if target2 in html:
    html = html.replace(target2, replacement2)
else:
    print("Warning: target2 not found exactly.")
    # Fallback to regex if exact match fails
    html = re.sub(
        r'<p class="body-lg text-ink-700 w-full" style="word-break: keep-all; ">\s*MONO는 숙련 기술자의 경험과 현장 데이터를 기반으로 AI와 협업 로봇이 더 안전하고 효율적으로 일할 수 있도록 지원합니다. 위험하고 반복적인 작업은 기술이 돕고, 기술자는 더 안전하게 더 높은 가치의 일에 집중합니다. 축적된 생산성의 성과는 기술자와 함께 공유되며, MONO는 미래 인재 육성과 상생 기술노동 산업 인프라를 완성합니다.\s*</p>',
        replacement2,
        html
    )

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Simplified section 06 text for mobile.")
