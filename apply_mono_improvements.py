import os

def main():
    file_path = "public/pitch.html"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    replacements = []

    # 1. Hero Title & Main Paragraph
    old_hero = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">01</span> MONO 서비스 소개 · 스마트 일자리 플랫폼</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">기술노동자를 위한 디지털 인력사무소, MONO</h2>
      <p class="body-lg mt-4 font-bold text-ink-900" style="font-size: 1.35rem; line-height: 1.4;">기술자의 경험을 자산으로 만들고, 산업 현장의 데이터를 미래 기술 혁신으로 연결하는 스마트 현장 플랫폼</p>
      <p class="hidden md:block body-lg mt-4 text-justify" style="font-size: 1.15rem; line-height: 1.75; color: #1B2436;">
        <strong>MONO는 건설·조선·플랜트 등 국가 핵심 기술노동 산업을 위한 통합 디지털 인력사무소입니다.</strong><br />
        현장 근무자에게는 평생 경력을 쌓아갈 <strong>스마트 일자리 플랫폼</strong>을, 원·하청 기업에게는 검증된 숙련 인력을 즉시 배치하는 <strong>디지털 인력사무소</strong>를 제공하여, 현장 협업 로봇과 함께하는 미래 기술 장인 산업 인프라를 구축합니다. MONO는 근무자와 기업을 신뢰할 수 있는 투명한 안전 장부 위에 묶어, 온·오프라인 현장 밀착형 연결의 선순환을 완성합니다.
      </p>"""
    
    new_hero = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-6"><span class="num">01</span> MONO 서비스 소개 · 기술자 신뢰 데이터 플랫폼</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight">산업 현장의 경험과 신뢰를 데이터로 연결하는 산업 신뢰 인프라 플랫폼, MONO</h2>
      <p class="body-lg mt-4 font-bold text-ink-900" style="font-size: 1.35rem; line-height: 1.4;">기술자의 경력·자격·현장 경험을 신뢰 데이터로 축적하고, 기업의 인력 운영, 외국인 기술인력 관리, 포용금융, 대기업 상생 인프라로 확장합니다.</p>
      <p class="hidden md:block body-lg mt-4 text-justify" style="font-size: 1.15rem; line-height: 1.75; color: #1B2436;">
        <strong>MONO는 산업 현장의 경험과 신뢰를 데이터로 연결하는 산업 신뢰 인프라 플랫폼입니다.</strong><br />
        기술자의 경력·자격·현장 경험을 신뢰 데이터로 축적하고, 이를 기업의 인력 운영, 외국인 기술인력 관리, 포용금융, 대기업 상생 인프라로 확장합니다. 기존의 단순 매칭 중심 일자리 앱을 넘어, 근무자와 기업을 투명한 안전·경력 장부 위에 연결하여 온·오프라인 현장 밀착형 신뢰 플랫폼을 완성하고 국가 핵심 기술노동 산업의 지속 가능한 생태계를 구축합니다.
      </p>"""
    replacements.append(("Hero Slogan", old_hero, new_hero))

    # 2. Hero Mobile check-list
    old_hero_mobile = """      <!-- Mobile Only Simplified Text (App Style) -->
      <div class="block md:hidden mt-6 bg-warm-100/50 border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">국가 핵심 기술노동 산업 통합 <strong class="font-bold">디지털 인력사무소</strong></p>
        </div>
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3 bg-warm-50/50">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">근무자에게는 <strong class="font-bold">스마트 일자리 플랫폼</strong> 제공</p>
        </div>
        <div class="p-4 flex items-start gap-3">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">기업에게는 검증된 숙련 인력 <strong class="font-bold">즉시 배치</strong></p>
        </div>
      </div>"""

    new_hero_mobile = """      <!-- Mobile Only Simplified Text (App Style) -->
      <div class="block md:hidden mt-6 bg-warm-100/50 border border-ink-900/10 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">산업 현장의 경험과 신뢰를 연결하는 <strong class="font-bold">산업 신뢰 인프라 플랫폼</strong></p>
        </div>
        <div class="p-4 border-b border-ink-900/5 flex items-start gap-3 bg-warm-50/50">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">개인 경력을 디지털 자산화하는 <strong class="font-bold">기술자 신뢰 데이터 플랫폼</strong></p>
        </div>
        <div class="p-4 flex items-start gap-3">
          <div class="bg-ink-900/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid fa-check text-ink-900 text-[10px]"></i>
          </div>
          <p class="text-[15px] font-medium text-ink-900 leading-[1.4] tracking-tight" style="word-break:keep-all;">데이터 기반의 투명하고 효율적인 <strong class="font-bold">인력 운영 및 안전 관리 지원</strong></p>
        </div>
      </div>"""
    replacements.append(("Hero Mobile Checklist", old_hero_mobile, new_hero_mobile))

    # 3. Hero B2C / B2B Cards
    old_cards = """    <div class="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 stagger">
      <!-- B2C Card -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 lg:p-9 shadow-blueprint">
        <div class="flex items-center gap-3 mb-6">
          <span class="chip bg-warm-100 text-ink-900 border border-ink-900/15">개인 근무자용</span>
          <span class="mono text-[13.5px] font-bold text-ink-700">/ 스마트 일자리 플랫폼</span>
        </div>
        <h3 class="text-xl lg:text-[22px] font-black text-ink-900 mb-4 tracking-tight break-keep">어디서든 일하고, 내 기술이 자산이 되는 스마트 일자리 플랫폼.</h3>
        <p class="body-md mb-6 text-justify">세계 어디에서 일하든 출역·기술·안전 데이터가 근무자 본인의 이름으로 축적됩니다. 그 데이터는 곧 금융·이주·교육으로 이어지는 신분증이 되어, 짧게 끊기던 일용직 경력을 한 사람의 소중한 평생 커리어로 이어줍니다.</p>
        <div class="spec-list mb-6">
          <div class="row"><div class="k">기록</div><div>현장 근무 이력·기술·안전 점수 평생 누적</div></div>
          <div class="row"><div class="k">자산</div><div>대안 신용 등급 → 우대 대출·상해보험·은퇴 설계</div></div>
          <div class="row"><div class="k">호환</div><div>국가 간 기술 증명 · 글로벌 워크 패스</div></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">출역 데이터 로그</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">대안 신용 등급</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">글로벌 워크 패스</span>
        </div>
      </article>

      <!-- B2B Card -->
      <article class="relative bg-warm-100/50 border border-ink-900/15 lcorner lcorner-tech hover-lift p-7 lg:p-9 shadow-blueprint">
        <div class="flex items-center gap-3 mb-6">
          <span class="chip bg-warm-100 text-ink-900 border border-ink-900/15">기업 고객용 (원청·하청)</span>
          <span class="mono text-[13.5px] font-bold text-ink-700">/ 기술노동자를 위한 디지털 인력사무소</span>
        </div>
        <h3 class="text-xl lg:text-[22px] font-black text-ink-900 mb-4 tracking-tight break-keep">데이터로 검증된 숙련 장인을 실시간으로 매칭 및 배치.</h3>
        <p class="body-md text-ink-700 mb-6 text-justify">인력 모집·계약·정산·안전 관리가 하나의 클라우드 대시보드에 모입니다. 월구독형 B2B SaaS(기업용 업무관리 서비스) 솔루션을 통해 불투명한 인력 알선망을 거치지 않고 직접 숙련 인력에 닿으며, 모든 출역 현황이 투명하게 관리됩니다.</p>
        <div class="spec-list mb-6">
          <div class="row"><div class="k">매칭</div><div>기술 데이터 기반 정밀 매칭 · 호출 즉시 출역</div></div>
          <div class="row"><div class="k">정산</div><div>투명한 안전 예치 에스크로 정산 · 당일 정산 즉시 지급</div></div>
          <div class="row"><div class="k">안전</div><div>일일 상해보험 자동 가입 · 산재 신고 자동화</div></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">실시간 데이터 매칭</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">에스크로 안전 정산</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">중대재해 예방 자동화</span>
        </div>
      </article>
    </div>"""

    new_cards = """    <div class="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 stagger">
      <!-- B2C Card -->
      <article class="relative bg-warm-50 border border-ink-900/15 lcorner hover-lift p-7 lg:p-9 shadow-blueprint">
        <div class="flex items-center gap-3 mb-6">
          <span class="chip bg-warm-100 text-ink-900 border border-ink-900/15">개인 근무자용</span>
          <span class="mono text-[13.5px] font-bold text-ink-700">/ 기술자 신뢰 데이터 플랫폼</span>
        </div>
        <h3 class="text-xl lg:text-[22px] font-black text-ink-900 mb-4 tracking-tight break-keep">경험이 자산이 되고, 신뢰가 가치가 되는 기술자 신뢰 데이터 플랫폼.</h3>
        <p class="body-md mb-6 text-justify">어디에서 일하든 출역·기술·안전 데이터가 근무자 본인의 디지털 경력 자산으로 축적됩니다. 그 데이터는 금융·이주·교육 제휴 혜택과 연결되는 신뢰 인증서가 되어, 일회성에 그치던 기술 경력을 신뢰할 수 있는 평생 커리어로 이어줍니다.</p>
        <div class="spec-list mb-6">
          <div class="row"><div class="k">기록</div><div>현장 근무 이력·자격·안전교육 이수 기록 누적</div></div>
          <div class="row"><div class="k">자산</div><div>대안 신용 등급 기반 → 우대 대출 및 제휴 보험·금융 서비스 연계</div></div>
          <div class="row"><div class="k">호환</div><div>국가 간 기술 자격 증명 및 글로벌 경력 데이터 연계</div></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">경력 및 자격 데이터</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">대안 신용 등급 연계</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">글로벌 경력 호환</span>
        </div>
      </article>

      <!-- B2B Card -->
      <article class="relative bg-warm-100/50 border border-ink-900/15 lcorner lcorner-tech hover-lift p-7 lg:p-9 shadow-blueprint">
        <div class="flex items-center gap-3 mb-6">
          <span class="chip bg-warm-100 text-ink-900 border border-ink-900/15">기업 고객용 (원청·하청)</span>
          <span class="mono text-[13.5px] font-bold text-ink-700">/ B2B 인력 운영 플랫폼</span>
        </div>
        <h3 class="text-xl lg:text-[22px] font-black text-ink-900 mb-4 tracking-tight break-keep">검증된 기술자 데이터를 기반으로 기업 인력 운영 의사결정 지원.</h3>
        <p class="body-md text-ink-700 mb-6 text-justify">인력 관리, 안전 교육 이수 이력, 근무 현황이 하나의 클라우드 워크스페이스에 통합 관리됩니다. B2B SaaS 솔루션을 통해 수기 중심의 번거로운 업무 프로세스를 데이터화하고, 기술자 프로필 데이터 분석을 통해 현장의 안정성과 연속성을 확보합니다.</p>
        <div class="spec-list mb-6">
          <div class="row"><div class="k">운영</div><div>데이터 기반 기술자 프로필 연결 및 인력 관리 지원</div></div>
          <div class="row"><div class="k">정산</div><div>정산 흐름의 투명화 관리 및 제휴사 기반 지급 구조 검토</div></div>
          <div class="row"><div class="k">안전</div><div>보험사 제휴 기반 안전·보험 연계 및 근무 리스크 관리 자료 제공</div></div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">인력 운영 데이터</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">제휴 기반 정산 흐름 관리</span>
          <span class="chip chip-round bg-warm-50 text-ink-900 border border-ink-200">현장 안전 리스크 관리</span>
        </div>
      </article>
    </div>"""
    replacements.append(("Hero B2C/B2B Cards", old_cards, new_cards))

    # 4. Escrow and SaaS Regulation expressions
    old_escrow = """        <h3 class="text-base font-black text-ink-900">안전 연동 및 안심 정산</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">출근 전 간편 안전 교육 이수 로그를 실시간 남기고, 정산 체계를 에스크로(안전지갑)로 묶어 임금 체불 공포를 완전히 해결합니다.</p>"""
    new_escrow = """        <h3 class="text-base font-black text-ink-900">안전 연동 및 안심 정산</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">출근 전 간편 안전 교육 이수 데이터를 기록으로 연계하고, 정산 흐름의 시각화와 제휴사 기반의 에스크로 정산 구조를 검토하여 정산 관련 불안을 해소합니다.</p>"""
    replacements.append(("SaaS Escrow mitigation", old_escrow, new_escrow))

    old_saas_agency = """        <h3 class="text-base font-black text-ink-900">기업용 서비스 (SaaS)</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">하청 소장의 골머리를 썩이던 4대 보험 신고, 세무 신고, 출역 관제 복잡성을 마우스 클릭 한 번으로 자동 대행해 줍니다.</p>"""
    new_saas_agency = """        <h3 class="text-base font-black text-ink-900">기업용 서비스 (SaaS)</h3>
        <p class="text-[13px] text-ink-700 leading-relaxed word-keep">현장 인력 관리의 비효율성을 해소하며, 노무·세무 대리인 및 관련 전문 제휴사와의 데이터 연계를 통해 복잡한 행정 업무 처리를 지원합니다.</p>"""
    replacements.append(("SaaS Agency mitigation", old_saas_agency, new_saas_agency))

    # 5. Stepper absolute wording
    old_fusion = '<p class="body-md text-ink-800 leading-relaxed font-bold mb-4">협업 로보틱스, 스마트 현장 데이터, 땀의 가치 정밀 평가 시스템이 완전 융합된 차세대 미래형 산업 현장 플랫폼.</p>'
    new_fusion = '<p class="body-md text-ink-800 leading-relaxed font-bold mb-4">협업 로보틱스, 스마트 현장 데이터, 땀의 가치 정밀 평가 시스템이 유기적으로 연계된 차세대 미래형 산업 현장 플랫폼.</p>'
    replacements.append(("Stepper absolute wording", old_fusion, new_fusion))

    # 6. GTM Step 2 List of features
    old_gtm_s2 = """            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">국내 산업 현장 외국인 근로자 데이터 통합 관리</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold mb-4">MONO는 국내 건설·조선·플랜트·제조 현장에 이미 근무 중인 외국인 근로자의 체류, 고용, 교육, 안전, 경력 데이터를 통합 관리하는 기업용 SaaS로 확장합니다. 이를 통해 기업은 외국인 인력 운영 리스크를 줄이고, 협력사 인력 현황과 숙련 인재 육성 데이터를 확보할 수 있습니다.</p>
            <ul class="body-md text-ink-700 leading-relaxed space-y-2 font-normal">
              <li><i class="fa-solid fa-language text-tech-600 w-5"></i> 외국인 근로자 다국어 프로필 지원</li>
              <li><i class="fa-solid fa-passport text-tech-600 w-5"></i> 체류·고용 상태 관리 및 고용 가능 기간 알림</li>
              <li><i class="fa-solid fa-route text-tech-600 w-5"></i> 현장 배치 이력 관리</li>
              <li><i class="fa-solid fa-shield-halved text-tech-600 w-5"></i> 안전교육 이수 관리 및 숙련도 기록</li>
              <li><i class="fa-solid fa-file-invoice text-tech-600 w-5"></i> 숙련 인력 전환 검토 리포트 및 고용 리스크 점검 리포트 제공</li>
            </ul>"""

    new_gtm_s2 = """            <h3 class="text-xl md:text-2xl font-black text-ink-900 mb-3 tracking-tight">국내 산업 현장 외국인 근로자 데이터 통합 관리</h3>
            <p class="body-md text-ink-800 leading-relaxed font-bold mb-4">MONO는 국내 건설·조선·플랜트·제조 현장에 이미 근무 중인 외국인 근로자의 체류, 고용, 교육, 안전, 경력 데이터를 통합 관리하는 기업용 SaaS로 확장합니다. 이를 통해 기업은 외국인 인력 운영 리스크를 줄이고, 협력사 인력 현황과 숙련 인재 육성 데이터를 확보할 수 있습니다.</p>
            <ul class="body-md text-ink-700 leading-relaxed space-y-2 font-normal">
              <li><i class="fa-solid fa-language text-tech-600 w-5"></i> 외국인 근로자 다국어 프로필 지원 및 간편 번역</li>
              <li><i class="fa-solid fa-passport text-tech-600 w-5"></i> 체류 자격(비자) 진단 및 고용 가능 기간 자동 알림</li>
              <li><i class="fa-solid fa-route text-tech-600 w-5"></i> 실시간 현장 배치 현황 및 근태/출역 이력 모니터링</li>
              <li><i class="fa-solid fa-shield-halved text-tech-600 w-5"></i> 다국어 스마트 안전교육 이수 증명 및 실시간 관리</li>
              <li><i class="fa-solid fa-star text-tech-600 w-5"></i> 작업 숙련도 및 현장 다차원 평판 기록</li>
              <li><i class="fa-solid fa-circle-nodes text-tech-600 w-5"></i> 비자 전환(E-9 ➡️ E-7-4) 자격 시뮬레이션 및 조건 자동 진단</li>
              <li><i class="fa-solid fa-file-shield text-tech-600 w-5"></i> 원청/하청 실시간 인력 고용 리스크 점검 리포트 발급</li>
              <li><i class="fa-solid fa-chart-pie text-tech-600 w-5"></i> 대기업 상생 협력 및 ESG 경영 공시 대응 데이터 연계</li>
            </ul>"""
    replacements.append(("GTM Step 2 Features", old_gtm_s2, new_gtm_s2))

    # 12. R1 strategy operational boundary
    old_r1_table = """                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">외국인 근로자</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">체류·고용 상태 데이터 구조 설계</td>
                        <td class="p-2.5" style="word-break:keep-all;">고용허가, 체류자격, 근로조건, 행정기관 연계 검토</td>
                      </tr>
                    </tbody>
                  </table>
                </div>"""
    
    new_r1_table = """                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">외국인 근로자</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">체류·고용 상태 데이터 구조 설계</td>
                        <td class="p-2.5" style="word-break:keep-all;">고용허가, 체류자격, 근로조건, 행정기관 연계 검토</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 운영 경계 선언 카드 -->
                <div class="mt-6 bg-warm-100 border-l-4 border-tech-600 p-5 rounded-r">
                  <div class="text-[11px] font-mono font-bold text-tech-600 tracking-widest mb-1.5">INITIAL OPERATION BOUNDARY · 운영 경계 선언</div>
                  <p class="text-[13px] text-ink-800 leading-relaxed font-semibold mb-2" style="word-break:keep-all;">
                    MONO의 초기 MVP는 기술자 신뢰 프로필, 경력·자격 데이터 관리, 기업의 기술자 데이터 조회 수요, 현장 인력관리 SaaS 가능성을 검증하는 범위에서 운영됩니다.
                  </p>
                  <p class="text-[12.5px] text-ink-700 leading-relaxed" style="word-break:keep-all;">
                    고용계약 체결, 근로조건 결정, 현장 지휘·명령, 유료 직업소개 수수료, 정산 대행 기능은 관련 인허가 및 제휴 구조 검토 이후 단계적으로 적용합니다.
                  </p>
                </div>"""
    replacements.append(("R1 Operation Boundary", old_r1_table, new_r1_table))

    # 13. R2 strategy KPI targets
    old_r2_targets = """              <!-- 5. 최종 목표 -->
              <div class="border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint">
                <div class="h-eyebrow mb-4 text-tech-700">6. 2라운드 최종 목표</div>"""
    
    new_r2_targets = """              <!-- 2라운드 KPI 목표선 및 데이터 검증 기준 -->
              <div class="border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint">
                <div class="h-eyebrow mb-3 text-tech-700">5. 2라운드 핵심 KPI 목표선 및 시장 검증 기준</div>
                <p class="body-md text-ink-700 mb-6" style="word-break:keep-all;">
                  2라운드의 목표는 단순 가입자 수 경쟁보다 기술자와 기업의 실제 행동 데이터를 확보하는 것입니다. MONO는 기술자 프로필 완성률, 경력 등록률, Fake Door 클릭률, Aha Moment 후보별 재방문율, 기업의 조회·저장 행동을 기반으로 시장 검증 결과를 판단합니다.
                </p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-[12px] md:text-[13px] border border-ink-900/10">
                    <thead>
                      <tr class="border-b border-ink-900/15 text-ink-900 font-bold bg-warm-100">
                        <th class="p-2.5 border-r border-ink-900/10">측정 영역</th>
                        <th class="p-2.5">검증 성공 기준 (KPI 목표선)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-ink-900/5 text-ink-800 bg-white">
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">기술자 심층 인터뷰</td>
                        <td class="p-2.5 font-semibold text-tech-700">50명 이상 인터뷰 완료</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">기업 심층 인터뷰</td>
                        <td class="p-2.5 font-semibold text-tech-700">20~30개사 인터뷰 완료</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">기본 프로필 완성률</td>
                        <td class="p-2.5 font-semibold text-tech-700">가입자 중 40% 이상</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">경력 1건 등록률</td>
                        <td class="p-2.5 font-semibold text-tech-700">가입자 중 30% 이상</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">경력 3건 등록률</td>
                        <td class="p-2.5 font-semibold text-tech-700">가입자 중 15% 이상</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">프로필 외부 공유율</td>
                        <td class="p-2.5 font-semibold text-tech-700">가입자 중 10% 이상</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">Fake Door 클릭률</td>
                        <td class="p-2.5 font-semibold text-tech-700">기능별 5% ~ 15% 수준 달성</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">7일 재방문율 (주간 리텐션)</td>
                        <td class="p-2.5 font-semibold text-tech-700">가입자 세그먼트별 15% ~ 25% 확보</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">기업 관심 기술자 저장률</td>
                        <td class="p-2.5 font-semibold text-tech-700">프로필을 조회한 기업 중 20% 이상 저장</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">PoC 관심 기업 확보</td>
                        <td class="p-2.5 font-semibold text-tech-700">시범 운영(PoC) 참여 기업 3~5개사 이상 확보</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 5. 최종 목표 -->
              <div class="border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint">
                <div class="h-eyebrow mb-4 text-tech-700">6. 2라운드 최종 목표</div>"""
    replacements.append(("R2 KPI Targets", old_r2_targets, new_r2_targets))

    # 14. R3 STAGE 02 Lock-in structure
    old_r3_stages = """                  <div class="p-4 bg-white rounded border border-ink-900/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span class="text-[10px] font-mono text-tech-600 font-bold block mb-1">STAGE 05</span>
                      <div class="text-xs font-bold text-ink-900 mb-1.5">Global Infrastructure</div>
                      <p class="text-[11px] text-ink-700 leading-relaxed font-normal">기술자 네트워크, 기업 인력 운영, 산업 기술 마켓플레이스가 연결된 글로벌 인프라로 도약</p>
                    </div>
                  </div>
                </div>"""
    
    new_r3_stages = """                  <div class="p-4 bg-white rounded border border-ink-900/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <span class="text-[10px] font-mono text-tech-600 font-bold block mb-1">STAGE 05</span>
                      <div class="text-xs font-bold text-ink-900 mb-1.5">Global Infrastructure</div>
                      <p class="text-[11px] text-ink-700 leading-relaxed font-normal">기술자 네트워크, 기업 인력 운영, 작업 기술 마켓플레이스가 연결된 글로벌 인프라로 도약</p>
                    </div>
                  </div>
                </div>

                <!-- STAGE 02 락인 구조 (외국인 기술인력 관리 SaaS) -->
                <div class="mt-8 bg-white border border-ink-900/10 p-6 rounded-lg shadow-sm">
                  <div class="text-xs font-mono font-bold text-tech-600 tracking-widest mb-2">STAGE 02 LOCK-IN STRUCTURE</div>
                  <h4 class="text-base font-black text-ink-900 mb-3">국내 유입 외국인 기술인력 관리 SaaS 락인 구조</h4>
                  <p class="text-[12.5px] text-ink-700 leading-relaxed mb-4" style="word-break:keep-all;">
                    MONO의 STAGE 02는 해외 진출 전 단계에서 국내 산업 현장에 이미 유입된 외국인 기술인력 데이터를 축적하는 전략입니다. 이 데이터는 기업의 인력 운영 리스크 관리, 원청의 협력사 관리, 공공기관의 고용 질서 및 숙련 인재 육성 정책과 연결됩니다.
                  </p>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-[12px] md:text-[13px] border border-ink-900/10">
                      <thead>
                        <tr class="border-b border-ink-900/15 text-ink-900 font-bold bg-warm-100">
                          <th class="p-2.5 border-r border-ink-900/10 w-1/4">대상</th>
                          <th class="p-2.5 border-r border-ink-900/10 w-1/2">MONO 사용 이유</th>
                          <th class="p-2.5">축적 데이터</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-ink-900/5 text-ink-800 bg-white">
                        <tr>
                          <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">외국인 기술자</td>
                          <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">한국 현장 경력, 안전교육 이수 기록, 숙련도 및 장기 근속 이력이 공인된 개인 경력 자산으로 투명하게 축적됨</td>
                          <td class="p-2.5 font-mono" style="word-break:keep-all;">경력, 교육, 숙련도, 현장 평가</td>
                        </tr>
                        <tr>
                          <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">협력사</td>
                          <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">비자 만료일, 법적 고용 가능 기간, 안전교육 이수 상태, 현장 배치 이력을 하나의 대시보드에서 실시간 통합 관리함</td>
                          <td class="p-2.5 font-mono" style="word-break:keep-all;">체류, 고용, 배치, 안전교육</td>
                        </tr>
                        <tr>
                          <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">원청·대기업</td>
                          <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">하청 협력사들의 외국인 인력 고용 현황, 안전교육 이수율, 노무/고용 리스크, ESG 및 상생 지표 데이터를 투명하게 실시간 관제함</td>
                          <td class="p-2.5 font-mono" style="word-break:keep-all;">협력사 인력, 리스크, ESG, 안전</td>
                        </tr>
                        <tr>
                          <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">정부·공공기관</td>
                          <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">적법한 고용 질서 확립, 국내 산업 숙련 인재 육성 정책 효과 진단, 표준 안전교육 및 경력 인증에 필요한 공인 실증 데이터 확보 가능</td>
                          <td class="p-2.5 font-mono" style="word-break:keep-all;">고용, 교육, 숙련, 경력 인증</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>"""
    replacements.append(("R3 STAGE 02 Lock-in", old_r3_stages, new_r3_stages))

    # 15. R3 Competitor Analysis Table (Data structure centric)
    old_r3_comp = """              <!-- 3-3. 국내외 유사 기업 분석 -->
              <div class="border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint">
                <div class="h-eyebrow mb-4 text-tech-700">3. 국내외 유사 기업과 MONO의 포지션</div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr class="border-b border-ink-900/15 text-ink-900 font-bold bg-warm-50">
                        <th class="p-3">구분</th>
                        <th class="p-3">유사 기업 유형</th>
                        <th class="p-3">MONO의 차별성</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-ink-900/5 text-ink-800">
                      <tr>
                        <td class="p-3 font-bold bg-warm-50/50">경력 네트워크</td>
                        <td class="p-3">LinkedIn</td>
                        <td class="p-3" style="word-break:keep-all;">화이트칼라 중심 경력 네트워크와 달리 기술자의 현장 경험, 자격, 작업 이력, 신뢰 데이터를 중심으로 축적</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold bg-warm-50/50">현장 운영 SaaS</td>
                        <td class="p-3">ServiceTitan, Procore</td>
                        <td class="p-3" style="word-break:keep-all;">기업 업무관리 중심을 넘어 기술자 신뢰 데이터와 산업 현장 데이터를 함께 연결</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold bg-warm-50/50">인력 매칭</td>
                        <td class="p-3">구인구직 플랫폼, 일용직 앱</td>
                        <td class="p-3" style="word-break:keep-all;">일자리 연결에서 출발해 경력, 신뢰, 금융, 산업 데이터로 확장</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold bg-warm-50/50">산업 인력 플랫폼</td>
                        <td class="p-3">Workrise 계열</td>
                        <td class="p-3" style="word-break:keep-all;">특정 산업 인력 공급 모델을 넘어 건설·조선·플랜트·제조 전반의 산업 신뢰 인프라 지향</td>
                      </tr>
                      <tr>
                        <td class="p-3 font-bold bg-warm-50/50">기술 서비스 마켓</td>
                        <td class="p-3">산업 장비몰, 공구몰</td>
                        <td class="p-3" style="word-break:keep-all;">현장 데이터 기반으로 필요한 장비, 공구, 웨어러블, 로봇 기술을 연결</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>"""

    new_r3_comp = """              <!-- 3-3. 국내외 유사 기업 분석 (데이터 구조 중심 비교) -->
              <div class="border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint">
                <div class="h-eyebrow mb-4 text-tech-700">3. 데이터 구조 중심 유사 기업 비교 및 MONO의 포지션</div>
                <p class="body-md text-ink-700 mb-6" style="word-break:keep-all;">
                  MONO는 단일 채용 플랫폼이나 현장관리 SaaS보다 넓은 데이터 구조를 지향합니다. 기술자 개인의 경력·자격·안전·숙련 데이터와 기업의 인력 운영 데이터를 함께 축적하고, 이를 금융, 보험, 교육, 대기업 상생 인프라, 공공 실증으로 확장합니다.
                </p>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-[12px] md:text-[13px] border border-ink-900/10">
                    <thead>
                      <tr class="border-b border-ink-900/15 text-ink-900 font-bold bg-warm-50">
                        <th class="p-2.5 border-r border-ink-900/10">비교축</th>
                        <th class="p-2.5 border-r border-ink-900/10">LinkedIn</th>
                        <th class="p-2.5 border-r border-ink-900/10">ServiceTitan / Procore</th>
                        <th class="p-2.5 border-r border-ink-900/10">Workrise</th>
                        <th class="p-2.5 bg-tech-50 text-tech-700 font-black">MONO</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-ink-900/5 text-ink-800 bg-white">
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">핵심 사용자</td>
                        <td class="p-2.5 border-r border-ink-900/10">화이트칼라 개인</td>
                        <td class="p-2.5 border-r border-ink-900/10">기업 운영팀</td>
                        <td class="p-2.5 border-r border-ink-900/10">특정 산업 인력 공급처</td>
                        <td class="p-2.5 font-bold bg-tech-50/30">기술자, B2B 기업, 원청 대기업, 금융사, 공공기관</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">핵심 데이터</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">개인 이력서 경력 사항, 학력, 네트워크 인맥</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">현장 업무 지시, 일정, 자재 관리, 프로젝트 공정율</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">인력 매칭 결과 및 아웃소싱 파견 정보</td>
                        <td class="p-2.5 font-bold bg-tech-50/30" style="word-break:keep-all;">개인 경력·자격·안전교육 이수, GPS 출역 이력, 다차원 평판, 체류 정보(비자), 기업 인력 운영 데이터 통합</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">수익 모델</td>
                        <td class="p-2.5 border-r border-ink-900/10">채용 솔루션 수수료, 프리미엄 멤버십, 광고</td>
                        <td class="p-2.5 border-r border-ink-900/10">B2B SaaS 기업 라이선스 구독료</td>
                        <td class="p-2.5 border-r border-ink-900/10">인력 아웃소싱 파견 수수료 (공급 중심)</td>
                        <td class="p-2.5 font-bold bg-tech-50/30" style="word-break:keep-all;">B2B SaaS 구독료, 데이터 연계 비즈니스, 금융·보험사 제휴 수수료, 시범 운영(PoC) 및 상생 인프라 데이터 판매</td>
                      </tr>
                      <tr>
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10">확장 방향</td>
                        <td class="p-2.5 border-r border-ink-900/10">글로벌 커리어 네트워크 및 교육 연계</td>
                        <td class="p-2.5 border-r border-ink-900/10">현장 업무·정산 자동화 SaaS 중심 고도화</td>
                        <td class="p-2.5 border-r border-ink-900/10">산업별 전문 인력 공급망 수직 계열화</td>
                        <td class="p-2.5 font-bold bg-tech-50/30" style="word-break:keep-all;">산업 신뢰 데이터와 B2B 인력 운영 관리 데이터를 통합한 산업 신뢰 인프라 플랫폼</td>
                      </tr>
                      <tr class="bg-tech-50/10">
                        <td class="p-2.5 font-bold bg-warm-50/50 border-r border-ink-900/10 text-tech-800">MONO 차별성</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">개인 중심 경력 소통망</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">기업 내부 업무관리 최적화</td>
                        <td class="p-2.5 border-r border-ink-900/10" style="word-break:keep-all;">인력 매칭 및 공급 위주</td>
                        <td class="p-2.5 font-bold bg-tech-50/40 text-ink-900" style="word-break:keep-all;">개인 신뢰 데이터와 산업 인력 운영 관리 데이터를 함께 축적하여 신뢰 인프라 역할 수행</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>"""
    replacements.append(("R3 Competitor Matrix", old_r3_comp, new_r3_comp))

    # Apply standard static replacements first
    for label, old_text, new_text in replacements:
        if old_text in content:
            content = content.replace(old_text, new_text)
            print(f"[SUCCESS] Applied replacement for: {label}")
        else:
            print(f"[WARNING] Old text not found for: {label}")

    # ==================== DYNAMIC REPLACEMENTS (INDEX SLICING) ====================

    # D1. BM Section (Unified 4-stage Grid & SaaS Value Prop)
    new_bm_section = """    <!-- Unified Responsive 4-Stage BM Grid -->
    <div class="mb-6 reveal">
      <p class="body-md text-ink-800 bg-warm-100/50 border-l-4 border-tech-700 p-4 rounded-r mb-8 leading-relaxed" style="word-break:keep-all;">
        <strong>수익 모델 단계적 로드맵:</strong> MONO의 초기 수익 모델은 기술자 신뢰 프로필과 기업용 인력 운영 워크스페이스에서 시작합니다. 이후 현장관리 SaaS와 외국인 기술인력 관리 SaaS로 B2B 수익화를 확장하고, 정산·보험·금융·채용 수수료 모델은 제휴 및 인허가 검토 이후 단계적으로 적용합니다.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 reveal stagger">
      <!-- 1. 초기 BM -->
      <div class="bg-white border border-ink-200 lcorner p-6 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-700">
        <div class="absolute top-0 right-0 w-24 h-24 bg-warm-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-4 pb-3 border-b border-ink-900/10">
          <div>
            <div class="text-tech-700 font-mono font-bold tracking-widest text-[10px] mb-1">01. INITIAL STAGE</div>
            <h3 class="text-lg font-black text-ink-900">초기 BM</h3>
          </div>
          <span class="bg-tech-50 text-tech-700 text-[9px] px-1.5 py-0.5 font-bold rounded">검증 단계</span>
        </div>
        <p class="text-[11px] text-ink-600 mb-4" style="word-break:keep-all;">규제 리스크가 낮고 초기 시장 수요 및 데이터 검증에 가장 적합한 핵심 모델</p>
        <div class="space-y-4 flex-grow text-[12.5px]">
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-id-card text-tech-600 text-[11px]"></i> 기술자 프로필 관리</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">개인 신뢰 프로필 무료 빌더 및 디지털 자산 보관함 제공</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-eye text-tech-600 text-[11px]"></i> 기업 열람권 구독</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">인증된 기술자 데이터를 조회하려는 기업용 구독형 열람 라이선스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-folder-open text-tech-600 text-[11px]"></i> 기업용 워크스페이스</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">기술자 프로필 저장, 분류 및 내부 공유용 협업 대시보드</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-file-invoice text-tech-600 text-[11px]"></i> PoC 데이터 리포트</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">시범 운영 참여 기업 대상 현장 인력 숙련도/안전 분석 보고서</p>
          </div>
        </div>
      </div>

      <!-- 2. 중기 BM -->
      <div class="bg-white border border-ink-200 lcorner p-6 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-tech-500">
        <div class="absolute top-0 right-0 w-24 h-24 bg-tech-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-4 pb-3 border-b border-ink-900/10">
          <div>
            <div class="text-tech-600 font-mono font-bold tracking-widest text-[10px] mb-1">02. SaaS EXPANSION</div>
            <h3 class="text-lg font-black text-ink-900">중기 BM</h3>
          </div>
          <span class="bg-warm-100 text-ink-800 text-[9px] px-1.5 py-0.5 font-bold rounded">B2B 수익화</span>
        </div>
        <p class="text-[11px] text-ink-600 mb-4" style="word-break:keep-all;">현장 인력 관리 효율화 및 다국어 지원을 통한 본격 B2B 월간 구독 모델</p>
        <div class="space-y-4 flex-grow text-[12.5px]">
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-laptop-code text-tech-500 text-[11px]"></i> 현장관리 SaaS 구독료</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">출역 로그, 공정 일지, 안전 이력 연계 B2B 클라우드 플랫폼 구독</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-passport text-tech-500 text-[11px]"></i> 외국인 인력 SaaS</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">비자 상태, 고용 기간 알림, 안전 이수 통합 관리 SaaS 이용료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-shield-halved text-tech-500 text-[11px]"></i> 교육·안전 관리 시스템</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">현장 필수 다국어 교육 제공 및 수치화된 안전 점수 이력 연동</p>
          </div>
        </div>
      </div>

      <!-- 3. 제휴 후 BM -->
      <div class="bg-white border border-ink-200 lcorner p-6 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-safety-amber">
        <div class="absolute top-0 right-0 w-24 h-24 bg-safety-amber/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-4 pb-3 border-b border-ink-900/10">
          <div>
            <div class="text-safety-amber font-mono font-bold tracking-widest text-[10px] mb-1">03. PARTNERSHIP EXTENSION</div>
            <h3 class="text-lg font-black text-ink-900">제휴 후 BM</h3>
          </div>
          <span class="bg-safety-amber/20 text-ink-900 text-[9px] px-1.5 py-0.5 font-bold rounded">규제·인허가 완료</span>
        </div>
        <p class="text-[11px] text-ink-600 mb-4" style="word-break:keep-all;">인허가 취득 및 금융사·보험사·노무법인 제휴 후 제공되는 확장형 모델</p>
        <div class="space-y-4 flex-grow text-[12.5px]">
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-money-check-dollar text-safety-amber text-[11px]"></i> 투명한 정산 수수료</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">제휴 PG·에스크로 기반 정산 대행 및 수수료 (관련 인허가 전제)</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-wallet text-safety-amber text-[11px]"></i> 금융/보험 연계 수수료</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">1금융권 전세대출 추천 및 일일 단체상해보험 제휴 연계 수수료</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-handshake-simple text-safety-amber text-[11px]"></i> 채용 중개 수수료</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">검증된 기술자의 채용 연계 및 정규직 전환 수수료 (직업소개 인허가 후)</p>
          </div>
        </div>
      </div>

      <!-- 4. 장기 BM -->
      <div class="bg-white border border-ink-200 lcorner p-6 hover-lift shadow-sm flex flex-col relative overflow-hidden group border-t-4 border-t-ink-900">
        <div class="absolute top-0 right-0 w-24 h-24 bg-ink-900/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <div class="flex justify-between items-start mb-4 pb-3 border-b border-ink-900/10">
          <div>
            <div class="text-ink-900 font-mono font-bold tracking-widest text-[10px] mb-1">04. INDUSTRIAL INTELLIGENCE</div>
            <h3 class="text-lg font-black text-ink-900">장기 BM</h3>
          </div>
          <span class="bg-ink-900 text-warm-50 text-[9px] px-1.5 py-0.5 font-bold rounded">인프라 완성</span>
        </div>
        <p class="text-[11px] text-ink-600 mb-4" style="word-break:keep-all;">대규모 신뢰 데이터 축적 이후 산업 생태계와 융합하는 미래형 혁신 모델</p>
        <div class="space-y-4 flex-grow text-[12.5px]">
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-chart-line text-ink-900 text-[11px]"></i> Industrial Intelligence</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">축적된 현장/출역 원본 데이터 기반 대기업 상생 리포트 및 지표 판매</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-robot text-ink-900 text-[11px]"></i> AI 및 로보틱스 연계 (RaaS)</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">안전/경로 데이터 기반 현장 협업 로봇 임대 및 AI 현장 비서 서비스</p>
          </div>
          <div>
            <h4 class="font-bold text-ink-900 mb-0.5 flex items-center gap-1.5"><i class="fa-solid fa-toolbox text-ink-900 text-[11px]"></i> 장비·웨어러블 마켓</h4>
            <p class="text-[11.5px] text-ink-700 leading-relaxed">근무 이력에 따른 스마트 공구 및 보호구, 웨어러블 장비 직거래 플랫폼</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- B2B 외국인 기술인력 가치 제안 -->
    <div class="hidden md:block mt-8 border border-ink-900/10 p-6 md:p-8 rounded-lg bg-warm-100/40 shadow-blueprint reveal">
      <div class="h-eyebrow mb-4 text-tech-700">BM 가치 제안: 외국인 기술인력 관리 SaaS</div>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded border border-ink-900/10 shadow-sm">
          <div class="text-sm font-bold text-ink-900 mb-3 flex items-center gap-1.5"><i class="fa-solid fa-building text-tech-600"></i> B2B 기업 (원·하청)</div>
          <ul class="text-[12px] text-ink-800 space-y-2 list-disc pl-4 font-normal">
            <li><strong>현황 관리:</strong> 현장별 외국인 근로자 인원 및 배치 투명화</li>
            <li><strong>체류 관리:</strong> 비자 만료 및 고용 가능 기간 자동 알림</li>
            <li><strong>리스크 예방:</strong> 불법 고용 및 미인증 인력 배치 차단 리포트</li>
            <li><strong>안전 관리:</strong> 다국어 스마트 안전교육 이수 기록 모니터링</li>
          </ul>
        </div>
        <div class="bg-white p-5 rounded border border-ink-900/10 shadow-sm">
          <div class="text-sm font-bold text-ink-900 mb-3 flex items-center gap-1.5"><i class="fa-solid fa-user-helmet-safety text-tech-600"></i> 외국인 기술자</div>
          <ul class="text-[12px] text-ink-800 space-y-2 list-disc pl-4 font-normal">
            <li><strong>경력 인증:</strong> 한국 현장에서 축적된 근무 이력을 공인 데이터화</li>
            <li><strong>다국어 프로필:</strong> 비자 및 직무 경력 요약 카드 자동 생성</li>
            <li><strong>성장 경로:</strong> 숙련기능인력(E-7-4) 비자 전환 준비 상태 진단</li>
            <li><strong>권리 보호:</strong> 안전교육 이수 및 정산 이력 투명 기록</li>
          </ul>
        </div>
        <div class="bg-white p-5 rounded border border-ink-900/10 shadow-sm">
          <div class="text-sm font-bold text-ink-900 mb-3 flex items-center gap-1.5"><i class="fa-solid fa-handshake-angle text-tech-600"></i> 대기업·원청 및 사회</div>
          <ul class="text-[12px] text-ink-800 space-y-2 list-disc pl-4 font-normal">
            <li><strong>상생 인프라:</strong> 협력사 외국인 인력 현황 통합 관제</li>
            <li><strong>산재 예방:</strong> 현장 안전 규정 준수 이력 기반 산재 리스크 감소</li>
            <li><strong>ESG 평가:</strong> 투명한 노무 관리 및 미래 인재 육성 지표 확보</li>
            <li><strong>노동 질서:</strong> 적법 체류·안전 중심의 투명한 고용 환경 정착</li>
          </ul>
        </div>
      </div>
    </div>"""

    bm_start_tag = "<!-- Mobile Only: Simplified BM (App Style) -->"
    start_idx = content.find(bm_start_tag)
    if start_idx != -1:
        end_idx = content.find("</section>", start_idx)
        if end_idx != -1:
            content = content[:start_idx] + new_bm_section + "\n  </div>\n" + content[end_idx:]
            print("[SUCCESS] Applied replacement for: BM Section Grid (via index slicing)")
        else:
            print("[WARNING] Could not find </section> for BM section")
    else:
        print("[WARNING] BM start tag not found")

    # D2. Brand Philosophy Refinement & Tech-Blue Definition card
    new_philosophy = """    <div class="max-w-6xl mb-12 reveal">
      <div class="section-label mb-4"><span class="num">06</span> MONO 브랜드 철학 · 기술자 신뢰 데이터 플랫폼</div>
      <h2 class="h-display text-ink-900 leading-[1.2] md:leading-tight tracking-tight" style="word-break: keep-all;  text-align: justify;">땀 흘리며 일하는 즐거움을 아는 사람들, 우리가 함께 기술 장인 Tech-Blue의 미래를 만듭니다.</h2>
      <p class="hidden md:block body-lg mt-5" style="font-size: 1.2rem; line-height: 1.75;">MONO는 기술자의 현장 경험과 신뢰 데이터를 바탕으로 산업 생태계 전반의 지속 가능한 성장을 지원하는 신뢰 네트워크입니다. 청년, 워홀러, 디지털 노마드, 외국인 기술인력, 은퇴 장인까지 모든 세대의 현장 경험을 하나의 투명한 데이터 경제권 위에서 안전하게 연결하고, 그들의 땀의 가치와 사회적 신뢰를 높여갑니다.</p>
      <!-- Mobile Only -->
      <p class="block md:hidden mt-5 text-[15px] leading-snug text-ink-800 tracking-tight" style="word-break:keep-all;">근무 이력과 데이터를 기반으로 새로운 기술 장인의 미래를 함께 만듭니다. 전 세대 기술자의 사회적 신뢰와 땀의 가치를 존중합니다.</p>
    </div>

    <!-- 브랜드 철학 핵심 매니페스토 -->
    <div class="reveal mb-12 p-8 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group bg-warm-100/30 border border-ink-900/10 rounded-xl">
      <div class="tech-corner-mark"></div>
      <div class="absolute inset-0 blueprint opacity-25 pointer-events-none"></div>
      <div class="relative z-10">
        <span class="h-eyebrow text-ink-900 mb-4 tracking-widest block group-hover:text-tech-600 transition-colors">MONO의 세계관 &amp; 핵심 철학</span>
        <h3 class="text-xl md:text-3xl font-extrabold text-ink-900 leading-snug tracking-tight mb-4" style="word-break: keep-all;">
          &#8220;<span class="text-tech-600 font-extrabold">대한민국 산업 경쟁력의 시작은 현장의 기술자입니다.</span>&#8221;
        </h3>
        <div class="w-16 h-[2px] bg-gradient-to-r from-tech-400 to-tech-600 mx-auto mb-5 group-hover:w-24 transition-all duration-500"></div>
        <p class="hidden md:block body-lg text-ink-700 w-full" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련을 데이터로 기록하고, 이를 더 나은 일자리, 금융, 교육, 안전, 미래 기술 기회로 연결합니다. 우리는 현장의 사람이 더 오래 성장할 수 있는 산업 신뢰 인프라를 만듭니다.
        </p>
        <p class="block md:hidden text-[15px] leading-snug text-ink-700 w-full tracking-tight" style="word-break: keep-all;">
          MONO는 기술자의 경험과 숙련을 데이터로 기록하고, 이를 더 나은 일자리, 금융, 교육, 안전, 미래 기회로 연결하여 사람이 성장하는 산업 신뢰 인프라를 구축합니다.
        </p>
      </div>
    </div>

    <!-- Tech-Blue 개념 설명 카드 분리 (과밀화 해소) -->
    <div class="reveal mb-12 p-6 md:p-8 bg-tech-50/50 border border-tech-200 rounded-xl flex flex-col md:flex-row gap-6 items-center">
      <div class="w-12 h-12 rounded-full bg-tech-600 text-warm-50 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-robot text-lg"></i>
      </div>
      <div>
        <h4 class="text-lg font-black text-ink-900 mb-2">미래 기술 장인, Tech-Blue의 정의</h4>
        <p class="text-[13px] text-ink-800 leading-relaxed font-normal" style="word-break:keep-all;">
          <strong>Tech-Blue</strong>는 단순 육체노동 중심의 기존 현장 근로자를 넘어, 다년간 축적한 오프라인 현장 경험과 첨단 스마트 현장 데이터, 그리고 협업 로보틱스 기술을 융합하여 주도적으로 현장 안전과 효율을 이끄는 <strong>MONO가 정의하는 차세대 미래형 산업 기술인재</strong>를 뜻합니다.
        </p>
      </div>
    </div>"""

    target_str = "MONO 브랜드 철학"
    phil_pos = content.find(target_str)
    if phil_pos != -1:
        start_idx = content.rfind('<div class="max-w-6xl', 0, phil_pos)
        end_idx = content.find('<!-- 4대 핵심 미션 -->', phil_pos)
        if start_idx != -1 and end_idx != -1:
            content = content[:start_idx] + new_philosophy + "\n\n    " + content[end_idx:]
            print("[SUCCESS] Applied replacement for: Brand Philosophy Refinement (via dynamic search)")
        else:
            print("[WARNING] Could not find start/end indices for Brand Philosophy")
    else:
        print("[WARNING] 'MONO 브랜드 철학' not found")

    # D3. Next MONO Cards sorting (5-stage Roadmap & Description)
    new_next_mono_cards = """      <!-- 미래 확장 영역 5단계 로드맵 -->
      <div class="mb-12 reveal">
        <h3 class="text-2xl md:text-3xl font-black text-ink-900 mb-2 text-left">미래 확장 영역</h3>
        <p class="body-md text-ink-700 mb-8 text-left" style="word-break:keep-all;">
          Next MONO는 기술자 신뢰 프로필에서 시작해 기업 인력 운영, 외국인 기술인력 관리, 금융·보험·교육·안전 데이터로 확장됩니다. 장기적으로 이 데이터는 Industrial Intelligence Platform의 기반이 되며, 산업 AI, 로봇, 웨어러블, 장비 마켓플레이스와 연결됩니다.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-warm-50 border border-ink-900/10 lcorner p-5 hover:border-tech-600 hover:-translate-y-1 transition-all group">
            <div class="w-10 h-10 bg-tech-50 text-tech-700 border border-tech-200 flex items-center justify-center mb-3 group-hover:bg-tech-600 group-hover:text-warm-50 transition-colors">
              <i class="fa-solid fa-id-card text-sm"></i>
            </div>
            <div class="text-[11px] font-bold text-tech-600 font-mono tracking-widest mb-1">01. 현재 (Initial)</div>
            <div class="text-[15px] font-black text-ink-900 mb-2">기술자 신뢰 프로필</div>
            <p class="text-[12px] text-ink-600 leading-relaxed">개인의 경력·자격증 및 신뢰 데이터를 디지털 자산화</p>
          </div>
          <div class="bg-warm-50 border border-ink-900/10 lcorner p-5 hover:border-tech-600 hover:-translate-y-1 transition-all group">
            <div class="w-10 h-10 bg-tech-50 text-tech-700 border border-tech-200 flex items-center justify-center mb-3 group-hover:bg-tech-600 group-hover:text-warm-50 transition-colors">
              <i class="fa-solid fa-laptop-code text-sm"></i>
            </div>
            <div class="text-[11px] font-bold text-tech-600 font-mono tracking-widest mb-1">02. 단기 (Short-term)</div>
            <div class="text-[15px] font-black text-ink-900 mb-2">기업 인력 운영 SaaS</div>
            <p class="text-[12px] text-ink-600 leading-relaxed">출역 기록 및 B2B 인력·노무 관리 워크스페이스 제공</p>
          </div>
          <div class="bg-warm-50 border border-ink-900/10 lcorner p-5 hover:border-tech-600 hover:-translate-y-1 transition-all group">
            <div class="w-10 h-10 bg-tech-50 text-tech-700 border border-tech-200 flex items-center justify-center mb-3 group-hover:bg-tech-600 group-hover:text-warm-50 transition-colors">
              <i class="fa-solid fa-passport text-sm"></i>
            </div>
            <div class="text-[11px] font-bold text-tech-600 font-mono tracking-widest mb-1">03. 중기 (Mid-term)</div>
            <div class="text-[15px] font-black text-ink-900 mb-2">외국인 기술인력 SaaS</div>
            <p class="text-[12px] text-ink-600 leading-relaxed">체류 자격(비자) 및 안전 이수 상태 통합 관리 시스템</p>
          </div>
          <div class="bg-warm-50 border border-ink-900/10 lcorner p-5 hover:border-tech-600 hover:-translate-y-1 transition-all group">
            <div class="w-10 h-10 bg-tech-50 text-tech-700 border border-tech-200 flex items-center justify-center mb-3 group-hover:bg-tech-600 group-hover:text-warm-50 transition-colors">
              <i class="fa-solid fa-building-columns text-sm"></i>
            </div>
            <div class="text-[11px] font-bold text-tech-600 font-mono tracking-widest mb-1">04. 확장 (Expansion)</div>
            <div class="text-[15px] font-black text-ink-900 mb-2">금융·보험·교육·안전 데이터</div>
            <p class="text-[12px] text-ink-600 leading-relaxed">대안 신용 기반 금융 우대 추천 및 안전 교육 인프라 연동</p>
          </div>
          <div class="bg-warm-50 border border-ink-900/10 lcorner p-5 hover:border-tech-600 hover:-translate-y-1 transition-all group">
            <div class="w-10 h-10 bg-tech-50 text-tech-700 border border-tech-200 flex items-center justify-center mb-3 group-hover:bg-tech-600 group-hover:text-warm-50 transition-colors">
              <i class="fa-solid fa-robot text-sm"></i>
            </div>
            <div class="text-[11px] font-bold text-tech-600 font-mono tracking-widest mb-1">05. 장기 (Long-term)</div>
            <div class="text-[15px] font-black text-ink-900 mb-2">AI·로봇·웨어러블·Industrial Intelligence</div>
            <p class="text-[12px] text-ink-600 leading-relaxed">현장 협업 로봇 임대(RaaS) 및 AI 기반 장비 마켓플레이스</p>
          </div>
        </div>
      </div>"""

    target_str_next = "미래 확장 영역"
    next_pos = content.find(target_str_next)
    if next_pos != -1:
        # '미래 확장 영역'을 포함하는 헤더의 시작 지점을 rfind로 찾음
        marker_pos = content.rfind('미래 확장 영역', 0, next_pos)
        # 그 위의 '<!-- 미래 확장 영역 5개 -->' 또는 '<!-- Global Positioning -->'의 위치를 찾아 start_idx로 삼음
        # (Global Positioning의 밑에 있고 로봇 이노베이션의 위에 있음)
        # 2186라인에 Global Positioning이 있으므로, next_pos 직전의 '<!--'를 찾아 rfind 수행
        start_idx = content.rfind('<!--', 0, marker_pos)
        
        # 끝나는 부분은 '로봇 이노베이션'이 있는 곳 직전의 '<!--'
        end_marker_pos = content.find('로봇 이노베이션', next_pos)
        end_idx = content.rfind('<!--', next_pos, end_marker_pos) if end_marker_pos != -1 else -1
        
        if start_idx != -1 and end_idx != -1:
            content = content[:start_idx] + new_next_mono_cards + "\n\n      " + content[end_idx:]
            print("[SUCCESS] Applied replacement for: Next MONO Cards sorting (via dynamic search)")
        else:
            print(f"[WARNING] Could not find start/end indices. start_idx: {start_idx}, end_idx: {end_idx}")
    else:
        print("[WARNING] '미래 확장 영역' not found")

    # ==============================================================================

    # Write back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Finished apply_mono_improvements.py run.")

if __name__ == "__main__":
    main()
