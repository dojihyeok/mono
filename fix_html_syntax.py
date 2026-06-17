import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to find the broken part and replace it.
# The broken part is around line 1085:
broken_html = """        <!-- Strategy Summary Box (Full width bottom) -->
        <div class="mt-8 pt-7 border-t border-ink-900/10">
          <div class="flex items-center 
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
            </ul>
          </div>
        </div>"""

fixed_html = """        <!-- Strategy Summary Box (Full width bottom) -->
        <div class="mt-8 pt-7 border-t border-ink-900/10">
          <div class="flex items-center justify-start gap-4 mb-5">
            <span class="text-[17px] font-black text-ink-900">1라운드 준비 전략</span>
            <button onclick="document.getElementById('r1-strategy-modal').showModal()" class="text-[15px] font-bold text-tech-700 hover:text-tech-600 underline flex items-center gap-1.5 transition-colors">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> 상세 보기
            </button>
          </div>
          <div class="bg-transparent">
            <ul class="text-[16px] text-ink-800 space-y-3.5 list-none p-0 m-0">
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
            </ul>
          </div>
        </div>"""

html = html.replace(broken_html, fixed_html)

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed broken HTML")
