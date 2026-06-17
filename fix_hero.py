import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the main hero subtext or add the slogan into the hero.
# The hero contains: <p class="body-lg mt-4 font-bold text-tech-700" style="font-size: 1.35rem; line-height: 1.4;">기술자의 경험이 자산이 되고, 근무기록이 신뢰가 되는 스마트 현장 플랫폼</p>
# And: <h2 class="h-display text-ink-900">기술노동자를 위한 디지털 인력사무소, MONO</h2>

hero_slogan = """<p class="body-lg mt-4 font-bold text-tech-700" style="font-size: 1.35rem; line-height: 1.4;">기술자의 경험이 자산이 되고, 근무기록이 신뢰가 되는 스마트 현장 플랫폼</p>
      <div class="mt-4 inline-block px-4 py-2 bg-ink-900 text-warm-50 font-bold rounded shadow-sm">
        "우리는 사람을 대체하는 기술이 아니라, 사람의 가치를 증명하는 기술을 만듭니다."
      </div>"""

content = content.replace(
    '<p class="body-lg mt-4 font-bold text-tech-700" style="font-size: 1.35rem; line-height: 1.4;">기술자의 경험이 자산이 되고, 근무기록이 신뢰가 되는 스마트 현장 플랫폼</p>',
    hero_slogan
)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Hero slogan added")
