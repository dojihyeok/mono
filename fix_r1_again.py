import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the Summary Title and List in R1 Card
r1_summary_target = re.search(r'(<div class="mt-8 pt-7 border-t border-ink-900/10">\s*<div class="flex items-center )justify-between( mb-5">\s*<span class="text-\[17px\] font-black text-ink-900">1라운드 준비 전략</span>\s*<button onclick="document\.getElementById\(\'r1-strategy-modal\'\)\.showModal\(\)" class="text-\[15px\] font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1\.5 transition-colors">\s*<i class="fa-solid fa-arrow-up-right-from-square"></i> 상세 보기\s*</button>\s*</div>\s*<div class="bg-transparent">\s*<ul class="text-\[16px\] text-ink-800 space-y-3\.5 list-none p-0 m-0">)(.*?)(</ul>)', html, re.DOTALL)

if r1_summary_target:
    start_tag = r1_summary_target.group(1).replace('justify-between', 'justify-start gap-4')
    
    new_list = """
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">1. 핵심 목표:</strong> 완성된 서비스보다 빠르게 배우고 성장하는 과정을 증명</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">2. 멘토링 활용 전략:</strong> 적극적인 피드백 반영 루프 구축 및 실행</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">3. 규제 및 혁신 검토 과제:</strong> 사전 규제 대응 및 혁신 서비스 활용 준비</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">4. 투자 전략 수립:</strong> 전략적 VC 및 SI 네트워크 연계 방안 마련</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">5. 정부/파트너 협력 전략:</strong> 공공 및 민간 파트너십 구축 추진</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">6. MVP 방향성 및 공유:</strong> 지속적인 프로덕트 고도화 및 투명한 과정 공유</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">7. 1라운드 지원금 활용:</strong> 200만원을 통한 MVP 핵심 기능 검증 및 시연 준비</span>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="text-tech-500 mt-2 text-[10px]">●</span>
                <span class="leading-relaxed"><strong class="text-ink-900 font-bold">8. 2라운드 지원금 연계:</strong> 진출 시 1,000만원을 통한 실제 필드 테스트 및 서비스 고도화</span>
              </li>
"""
    html = html.replace(r1_summary_target.group(0), start_tag + new_list + "            </ul>")
    print("Updated R1 summary list and title layout.")
else:
    print("Could not find R1 summary block.")


# 2. Update Modal background colors
# Replace bg-white with bg-transparent for cards inside the modal
modal_target = re.search(r'(<dialog id="r1-strategy-modal".*?</dialog>)', html, re.DOTALL)
if modal_target:
    modal_html = modal_target.group(1)
    # The first card might have 'bg-warm-50' or 'bg-white'. Let's replace 'bg-white' globally inside modal_html
    # to 'bg-transparent'
    new_modal_html = modal_html.replace('bg-white', 'bg-transparent')
    html = html.replace(modal_target.group(1), new_modal_html)
    print("Removed white backgrounds in modal.")
else:
    print("Could not find modal.")

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
