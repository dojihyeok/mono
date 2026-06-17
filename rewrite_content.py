import re

with open('public/pitch.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. GTM Sections
# We will use regex to replace the ul blocks inside each step.
# Step 1
s1_ul = """<ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>가입 절차 간소화:</strong> 회원가입 시 제출 서류 최소화, 간편인증 연계, 건강보험 자격 정보 연동, 각종 증빙서류 자동 제출 지원</li>
              <li><strong>경력 인증 자동화:</strong> 자격증 등록, 교육 이수 내역 관리, 경력 포트폴리오 구축, 협회 및 기관 경력 연계 검토</li>
              <li><strong>외국인 기술자 관리:</strong> 해외 현지 모집 파트너십, 입국 전 사전 검증(디지털 프로필), 맞춤형 안전·문화 교육, E-7 비자 전환 등 생애주기 밀착 지원</li>
            </ul>"""
html = re.sub(r'(<h3 class="[^"]*">기술자 확보</h3>\s*)<ul.*?(?=\s*</div>\s*</div>)', r'\1' + s1_ul, html, flags=re.DOTALL)

# Step 2
s2_ul = """<ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>일자리 연결 전략:</strong> 지역 기반 일자리 추천, 기술 분야별 맞춤 추천, 장기 근무 현장 추천, 검증된 현장 정보 제공, 급여 및 근무조건 비교</li>
              <li><strong>파트너사 지원:</strong> 공고 등록 간소화, 반복 채용 템플릿, 우수 인재 추천 기능, 출역/근태/계약 관리 및 정산 자동화 지원</li>
            </ul>"""
html = re.sub(r'(<h3 class="[^"]*">일자리 연결 & 파트너사 확보</h3>\s*)<ul.*?(?=\s*</div>\s*</div>)', r'\1' + s2_ul, html, flags=re.DOTALL)

# Step 3
s3_ul = """<ul class="body-md text-ink-700 leading-relaxed space-y-3 mb-4">
              <li><strong>현장 반장 지원:</strong> MONO는 현장 반장의 경험과 노하우를 디지털 기술과 연결합니다. 출역 관리, 인력 배치 관리, 기술자 평가, 우수 인력 추천 등을 보다 효율적으로 운영할 수 있도록 지원합니다.</li>
              <li><strong>인력사무소 상생:</strong> MONO는 인력사무소를 대체하지 않습니다. 오히려 디지털 인력 관리 도구를 제공하여 인력 관리, 채용 관리, 정산 관리, 계약 관리 업무를 더욱 효율적으로 수행할 수 있도록 지원합니다.</li>
            </ul>"""
html = re.sub(r'(<h3 class="[^"]*">현장 반장 및 인력사무소 상생</h3>\s*)<ul.*?(?=\s*<div class="p-4 bg-warm-50)', r'\1' + s3_ul, html, flags=re.DOTALL)

# Step 4
s4_ul = """<ul class="body-md text-ink-700 leading-relaxed space-y-2">
              <li><i class="fa-solid fa-utensils text-tech-600 w-5"></i> 현장 주변 식당 정보 및 도시락 서비스 연계</li>
              <li><i class="fa-solid fa-bed text-tech-600 w-5"></i> 숙소 정보 및 휴게 공간 정보 제공</li>
              <li><i class="fa-solid fa-shower text-tech-600 w-5"></i> 샤워시설 정보 안내</li>
              <li><i class="fa-solid fa-hospital text-tech-600 w-5"></i> 병원 및 의료시설 정보 연계</li>
            </ul>"""
html = re.sub(r'(<h3 class="[^"]*">현장 생활 지원</h3>\s*<p[^>]*>목적: 기술자의 하루를 지원하는 생활 인프라 구축</p>\s*)<ul.*?(?=\s*</div>\s*</div>)', r'\1' + s4_ul, html, flags=re.DOTALL)

# Step 5
s5_ul = """<ul class="body-md text-ink-700 leading-relaxed space-y-3">
              <li><strong>기술자 성장 체계:</strong> 근무 이력 관리, 기술 등급 관리, 안전교육 관리, 통합 경력 관리 지원</li>
              <li><strong>금융 연결:</strong> 근무 기록 기반 신뢰 데이터로 대출 등 금융 서비스 연계 및 보험 연계</li>
              <li><strong>교육 지원:</strong> 현장 노하우 전수, 기술 교육 마켓플레이스, 해외 취업 교육 지원</li>
            </ul>"""
html = re.sub(r'(<h3 class="[^"]*">기술자 성장 지원</h3>\s*)<ul.*?(?=\s*</div>\s*</div>)', r'\1' + s5_ul, html, flags=re.DOTALL)

# BM Wording change
html = html.replace('기술자의 경력 데이터가 자산이 되는 모델', '기술자의 경험이 신뢰 데이터가 되는 모델')

bm_header_phrase_old = r'<h2 class="h-display text-ink-900 mb-4">기술자의 경험이 신뢰 데이터가 되는 모델</h2>'
bm_header_phrase_new = r'<h2 class="h-display text-ink-900 mb-4">기술자의 경험이 신뢰 데이터가 되는 모델</h2>\n      <p class="body-lg text-ink-800 font-bold max-w-4xl leading-relaxed" style="word-break: keep-all;">"기술자의 경험은 신뢰 데이터가 되고, 신뢰 데이터는 더 좋은 일자리와 금융 기회, 그리고 미래 기술의 기반이 됩니다."</p>'
if '"기술자의 경험은 신뢰 데이터가 되고' not in html:
    html = html.replace(bm_header_phrase_old, bm_header_phrase_new)

# Next MONO Phrase change
html = html.replace('사람과 AI가 함께 일하며 성장하는 시대', '사람과 AI가 함께 성장하는 시대, 기술자의 경험은 더 큰 가치가 됩니다.')

with open('public/pitch.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Changes applied to pitch.html.")
