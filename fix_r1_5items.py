import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We want to replace the 8 items with 5 items.
target_ul = re.search(r'(<ul class="text-\[16px\] text-ink-800 space-y-3\.5 list-none p-0 m-0">)(.*?)(</ul>)', html, re.DOTALL)

if target_ul:
    new_items = """
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">핵심 목표:</strong> 완성된 서비스보다 빠르게 배우고 성장하는 과정을 증명</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">멘토링 전략:</strong> 적극적인 피드백 반영 루프 구축 및 실행</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">투자 및 파트너십:</strong> 전략적 VC·SI 연계 및 공공·민간 파트너십 구축</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">MVP 방향성:</strong> 지속적인 프로덕트 고도화 및 투명한 과정 공유</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">지원금 활용:</strong> 1R(200만원) MVP 검증 / 2R(1,000만원) 실제 서비스 검증</span>
              </li>
"""
    html = html.replace(target_ul.group(0), target_ul.group(1) + new_items + target_ul.group(3))
    
    with open('public/pitch.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced with 5 items.")
else:
    print("Could not find the ul block.")
