import re
from bs4 import BeautifulSoup

def update_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 1. Section 01
    sec1 = soup.find(id='platform')
    if sec1:
        # H2 title update in section 1
        h2 = sec1.find('h2')
        if h2 and 'MONO는 기술자의 경험' in h2.text:
            h2.string = '기술자의 경험과 기업의 현장 수요를 신뢰 데이터로 연결하는 MONO'
        
        # main body text update
        p_desc = sec1.find('p', class_=re.compile(r'body-lg|text-ink-500|text-lg'))
        if p_desc and 'MONO는 기술자의 경험' in p_desc.text:
            new_p = soup.new_tag('p', class_="text-lg md:text-xl text-ink-500 max-w-4xl font-medium leading-relaxed mb-6")
            new_p.string = 'MONO는 기술자의 경험, 기업의 채용 수요, 현장 운영 데이터를 하나의 신뢰 데이터 흐름으로 연결하는 산업 신뢰 인프라 플랫폼입니다.'
            new_p2 = soup.new_tag('p', class_="text-lg md:text-xl text-ink-500 max-w-4xl font-medium leading-relaxed")
            new_p2.string = '기술자는 경력과 자격을 신뢰 프로필로 축적하고, 기업은 검증 가능한 기술자·현장 리더·팀을 찾으며, 현장 운영 데이터는 채용·장비·자재·교육·금융 기회로 확장됩니다.'
            p_desc.replace_with(new_p)
            new_p.insert_after(new_p2)
            
        # "왜 이 구조가 중요한가"
        for div in sec1.find_all('div'):
            h3 = div.find('h3')
            if h3 and '왜 이 구조가 중요한가' in h3.text:
                p_tag = div.find('p', class_=re.compile(r'text-ink-500|body-md'))
                if p_tag:
                    p_tag.clear()
                    p_tag.append('산업 현장의 문제는 사람, 기업, 장비와 운영 데이터가 분리되어 있다는 점입니다.')
                    p_tag.append(soup.new_tag('br'))
                    p_tag.append('MONO는 공고 등록, 프로필 작성, 팀 구성, 현장 투입, 운영과 평가를 하나의 흐름으로 연결해 반복 가능한 신뢰 데이터를 만듭니다.')
                break
                
        # Cards
        for h3 in sec1.find_all('h3'):
            if 'MONO Profile' in h3.text:
                p = h3.find_next('p')
                if p:
                    p.clear()
                    p.append('기술자의 경력, 자격, 안전교육, 현장 경험과 장비 사용 이력을 신뢰 프로필로 축적합니다.')
                    p.append(soup.new_tag('br'))
                    p.append('프로필은 채용, 교육, 금융, 보험과 글로벌 이동 기회로 확장됩니다.')
            elif 'MONO Partner Workspace' in h3.text:
                p = h3.find_next('p')
                if p:
                    p.string = '기업이 채용 공고, 현장 작업 요청, 기술자 검토, 팀 구성과 협력사 운영을 관리하는 기업용 업무공간입니다.'
            elif 'MONO Field Operations' in h3.text:
                p = h3.find_next('p')
                if p:
                    p.string = '공구·장비·소모자재·출역·근무환경·교육 수요를 연결해 현장 운영 데이터를 축적하는 확장 BM입니다.'

    # 2. Section 02 (problem)
    sec2 = soup.find(id='problem')
    if sec2:
        h2 = sec2.find('h2')
        if h2:
            h2.string = '일자리는 쉽게 찾고, 기업은 현장 수요를 쉽게 등록하는 상생 데이터 인프라'
            
        desc_container = h2.find_next('p').parent if h2.find_next('p') else None
        if desc_container:
            for p in desc_container.find_all('p'):
                if '본문' not in p.get('class', []): # just to make sure we don't delete everything if parent is huge
                    p.decompose()
            p1 = soup.new_tag('p', class_='text-lg text-ink-500 leading-relaxed mb-4')
            p1.string = 'MONO는 기술자가 일자리와 경력을 쌓고, 기업이 필요한 기술 인력과 현장 운영 데이터를 관리하도록 돕습니다.'
            p2 = soup.new_tag('p', class_='text-lg text-ink-500 leading-relaxed mb-4')
            p2.string = '채용 공고, 현장 작업 요청, 출역, 장비·자재, 교육과 평가 데이터는 하나의 신뢰 인프라로 축적됩니다.'
            p3 = soup.new_tag('p', class_='text-lg text-ink-500 leading-relaxed')
            p3.string = '이 데이터는 대기업 상생, 외국인 기술인력 관리, 포용금융과 미래 현장 기술로 확장됩니다.'
            desc_container.append(p1)
            desc_container.append(p2)
            desc_container.append(p3)

    # 3. Section 03 (startup)
    sec3 = soup.find(id='startup')
    if sec3:
        h2 = sec3.find('h2')
        if h2:
            p_desc = h2.find_next('p')
            if p_desc:
                p_desc.clear()
                p_desc.append('MONO의 초기 검증은 불특정 사용자를 모으는 방식보다, 원청 또는 중견 원청의 특정 현장을 Anchor PoC로 확보하는 방식으로 진행합니다.')
                p_desc.append(soup.new_tag('br'))
                p_desc.append('현장에서는 복잡한 SaaS보다 공구·장비 요청, 소모자재 반복 발주, 출역 명단과 안전교육 확인처럼 바로 필요한 업무부터 해결합니다.')

    # 4. Section 05 (bm)
    sec5 = soup.find(id='bm')
    if sec5:
        h2 = sec5.find('h2')
        if h2:
            p_desc = h2.find_next('p')
            if p_desc:
                p_desc.clear()
                p_desc.append('MONO의 수익모델은 기업의 반복 사용에서 시작합니다.')
                p_desc.append(soup.new_tag('br'))
                p_desc.append('기업은 공고 등록, 기술자·팀 검토, 협력사 운영을 위해 Workspace를 사용하고, MONO는 채용·팀 매칭, 현장 운영 거래, 금융·보험·교육 제휴로 수익을 확장합니다.')

    # 5. Section 06 (lifecycle)
    sec6 = soup.find(id='lifecycle')
    if sec6:
        header_div = sec6.find('div', class_=re.compile(r'text-sm|section-label'))
        if header_div and '06 MONO 브랜드 철학' in header_div.text:
            header_div.string = '06 MONO와 함께 만들어가는 순간들'
        
        h2 = sec6.find('h2')
        if h2:
            p_desc = h2.find_next('p')
            if p_desc:
                p_desc.string = 'MONO는 기술자의 경험이 단기 일거리로 사라지지 않고, 더 좋은 일자리, 안전한 근무환경, 포용금융, 보험, 교육과 미래 기술 기회로 이어지는 구조를 만듭니다.'
        
        tabs_map = {
            '입문': '첫 기술을 배우는 순간',
            '성장': '내 손으로 기회를 만드는 순간',
            '안정': '경력이 신뢰가 되는 순간',
            '확장': '더 큰 현장으로 이동하는 순간',
            '은퇴 이후': '삶을 다시 설계하는 순간',
            '자산화': '경험이 금융·교육·미래 기회가 되는 순간'
        }
        for button in sec6.find_all('button'):
            text = button.text.strip()
            if text in tabs_map:
                if button.string:
                    button.string = tabs_map[text]
                else:
                    for child in button.children:
                        if isinstance(child, str) and child.strip() in tabs_map:
                            child.replace_with(tabs_map[child.strip()])
                        elif child.name == 'span' and child.text.strip() in tabs_map:
                            child.string = tabs_map[child.text.strip()]

    # 6. Section 07 (vision)
    sec7 = soup.find(id='vision')
    if sec7:
        h2 = sec7.find('h2')
        if h2:
            p_desc = h2.find_next('p')
            if p_desc:
                p_desc.clear()
                p_desc.append('MONO가 축적하는 현장 데이터는 장기적으로 Tech-Blue 기술 인프라로 확장됩니다.')
                p_desc.append(soup.new_tag('br'))
                p_desc.append('기술자 경험, 현장 운영, 장비·자재, 안전·교육 데이터는 미래의 AI 현장 운영체제와 AGI Core OS를 위한 산업 데이터 기반이 됩니다.')
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

print("Updating files...")
update_html('/Users/yunhyeok/mono/web/public/strategy.html')
try:
    update_html('/Users/yunhyeok/mono/live_strategy.html')
except: pass
try:
    update_html('/Users/yunhyeok/mono/test.html')
except: pass
print("Done")
