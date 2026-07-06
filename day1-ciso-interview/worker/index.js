const page = String.raw`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Day1 Company CISO Interview | AX Security Team</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #07111f;
        --muted: #627184;
        --line: #d9e2ee;
        --paper: #fbfcff;
        --soft: #eef4fb;
        --navy: #071a33;
        --blue: #1766ff;
        --cyan: #00a6d6;
        --green: #13a06f;
        --red: #dc4458;
        --amber: #f1a51f;
      }

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
        color: var(--ink);
        background:
          linear-gradient(180deg, rgba(238,244,251,.96), rgba(255,255,255,.98) 38%),
          radial-gradient(circle at 80% 0%, rgba(23,102,255,.12), transparent 34rem);
        word-break: keep-all;
      }

      a { color: inherit; text-decoration: none; }
      .shell { min-height: 100vh; }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid rgba(217,226,238,.86);
        background: rgba(251,252,255,.9);
        backdrop-filter: blur(16px);
      }
      .topbar-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 14px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .mark {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        color: #fff;
        font-weight: 900;
        background: linear-gradient(135deg, var(--navy), var(--blue));
      }
      .brand small {
        display: block;
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .brand b {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
      }
      .nav {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .nav a, .pill {
        padding: 9px 11px;
        border-radius: 8px;
        color: #26384c;
        font-size: 13px;
        font-weight: 800;
      }
      .nav a:hover, .nav a.active { background: var(--soft); color: var(--blue); }

      main {
        max-width: 1180px;
        margin: 0 auto;
        padding: 34px 22px 74px;
      }
      section {
        scroll-margin-top: 82px;
        margin: 0 0 44px;
      }
      .hero {
        min-height: calc(100vh - 120px);
        display: grid;
        grid-template-columns: minmax(0, 1.18fr) minmax(320px, .82fr);
        gap: 28px;
        align-items: stretch;
      }
      .hero-copy {
        border-radius: 8px;
        color: #fff;
        padding: 46px;
        background:
          linear-gradient(135deg, rgba(7,26,51,.98), rgba(10,55,109,.98) 58%, rgba(19,160,111,.88));
        box-shadow: 0 24px 70px rgba(7,26,51,.18);
        position: relative;
        overflow: hidden;
      }
      .grid-overlay {
        position: absolute;
        inset: 0;
        opacity: .22;
        background-image:
          linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(90deg, transparent, #000 38%, #000);
      }
      .hero-copy > * { position: relative; z-index: 1; }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #cde6ff;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 18px 0 18px;
        max-width: 820px;
        font-size: clamp(38px, 5.5vw, 68px);
        line-height: 1.1;
        letter-spacing: -0.01em;
      }
      .lead {
        max-width: 760px;
        margin: 0;
        color: #e8f2ff;
        font-size: clamp(17px, 2vw, 20px);
        line-height: 1.62;
        font-weight: 600;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 28px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 8px;
        background: #fff;
        color: var(--navy);
        font-weight: 900;
      }
      .button.ghost {
        color: #fff;
        background: rgba(255,255,255,.1);
      }
      .button.outline {
        color: var(--navy);
        background: transparent;
        border-color: var(--line);
      }
      .button.outline:hover {
        background: var(--soft);
      }
      .hero-panel {
        display: grid;
        gap: 14px;
      }
      .profile-card, .metric-card, .panel, .card {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255,255,255,.9);
        box-shadow: 0 18px 44px rgba(7,17,31,.08);
      }
      .profile-card { padding: 24px; }
      .profile-card h2 {
        margin: 10px 0 8px;
        font-size: 28px;
      }
      .profile-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-weight: 700;
      }
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 18px;
      }
      .tag {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 0 10px;
        border-radius: 999px;
        background: #eaf2ff;
        color: #144fba;
        font-size: 12px;
        font-weight: 900;
      }
      .metric-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .metric-card { padding: 18px; }
      .metric-card b {
        display: block;
        font-size: 27px;
        line-height: 1.1;
        color: var(--blue);
      }
      .metric-card span {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 800;
      }

      .section-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 24px;
      }
      .section-head h2 {
        margin: 0;
        font-size: clamp(28px, 4vw, 42px);
        letter-spacing: 0;
      }
      .section-head p {
        max-width: 660px;
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-weight: 700;
      }
      .panel { padding: 26px; }
      .cards-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .card { padding: 24px; box-shadow: none; position: relative; display: flex; flex-direction: column; }
      .card h3 {
        margin: 0 0 12px;
        font-size: 21px;
      }
      .card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-weight: 700;
        flex-grow: 1;
      }
      .num {
        display: inline-grid;
        place-items: center;
        width: 32px;
        height: 32px;
        margin-bottom: 16px;
        border-radius: 8px;
        color: #fff;
        background: var(--navy);
        font-size: 13px;
        font-weight: 900;
      }
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }
      .split {
        display: grid;
        grid-template-columns: .9fr 1.1fr;
        gap: 22px;
        align-items: stretch;
      }
      .quote {
        padding: 28px;
        border-radius: 8px;
        background: var(--navy);
        color: #fff;
      }
      .quote b {
        display: block;
        font-size: 28px;
        line-height: 1.3;
        margin-bottom: 16px;
      }
      .quote p {
        margin: 0;
        color: #d8e7fb;
        line-height: 1.62;
        font-weight: 700;
      }
      .list {
        display: grid;
        gap: 12px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .list li {
        display: grid;
        grid-template-columns: 10px 1fr;
        gap: 12px;
        color: #25374c;
        line-height: 1.52;
        font-weight: 800;
      }
      .dot {
        width: 8px;
        height: 8px;
        margin-top: 9px;
        border-radius: 50%;
        background: var(--blue);
      }
      .comparison {
        display: grid;
        grid-template-columns: 1fr 56px 1fr;
        gap: 16px;
        align-items: stretch;
      }
      .arrow {
        display: grid;
        place-items: center;
        color: var(--blue);
        font-size: 30px;
        font-weight: 900;
      }
      .legacy { border-top: 6px solid var(--red); }
      .future { border-top: 6px solid var(--green); }
      .org {
        display: grid;
        gap: 12px;
      }
      .org-top {
        display: grid;
        place-items: center;
      }
      .org-node {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        padding: 16px;
        text-align: left;
      }
      button.org-node {
        cursor: pointer;
        font: inherit;
      }
      .org-node strong { display: block; font-size: 18px; }
      .org-node span {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 800;
      }
      .org-node.selected {
        border-color: var(--blue);
        box-shadow: 0 0 0 3px rgba(23,102,255,.12);
      }
      .org-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .org-subgrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 10px;
      }
      .detail {
        min-height: 322px;
        border-left: 6px solid var(--blue);
      }
      .detail h3 {
        margin: 0 0 10px;
        font-size: 28px;
      }
      .detail p {
        margin: 0 0 18px;
        color: var(--muted);
        line-height: 1.58;
        font-weight: 700;
      }
      .roadmap {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
      }
      .step {
        border-top: 6px solid var(--blue);
        min-height: 230px;
      }
      .step:nth-child(2) { border-top-color: var(--cyan); }
      .step:nth-child(3) { border-top-color: var(--green); }
      .step:nth-child(4) { border-top-color: var(--amber); }
      .step small {
        color: var(--muted);
        font-weight: 900;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .step h3 { margin: 8px 0 10px; font-size: 19px; }
      
      .footer {
        margin-top: 50px;
        padding: 28px;
        border-radius: 8px;
        background: var(--navy);
        color: #fff;
      }
      .footer h2 { margin: 0 0 10px; font-size: 30px; }
      .footer p { margin: 0; color: #dbe7f7; line-height: 1.58; font-weight: 700; }
      
      /* 신규 컴포넌트들 */
      .highlight-box {
        background: #eff6ff;
        border-left: 4px solid var(--blue);
        padding: 20px;
        margin: 0 0 24px;
        font-weight: 600;
        font-size: 16px;
        line-height: 1.6;
        color: var(--navy);
        border-radius: 0 8px 8px 0;
      }
      .hero-toc {
        background: rgba(0,0,0,0.15);
        padding: 20px;
        border-radius: 8px;
        margin-top: 24px;
        font-weight: 600;
        font-size: 15px;
        line-height: 1.7;
      }
      .hero-toc p {
        margin: 0 0 10px;
        font-size: 16px;
        color: #fff;
      }
      .hero-toc ul {
        margin: 0;
        padding-left: 20px;
      }
      .cta-box {
        margin-top: 20px;
        padding: 16px;
        background: var(--soft);
        border: 1px solid var(--line);
        border-radius: 8px;
      }
      .cta-box p {
        margin: 0 0 12px !important;
        font-size: 14px;
        color: var(--muted);
      }
      .cta-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .flow-diagram {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      .flow-step {
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
      }
      .flow-step h3 { font-size: 17px; color: var(--navy); margin: 0 0 10px; }
      .flow-step p { font-size: 14px; color: var(--muted); line-height: 1.5; margin: 0; flex-grow: 1; }
      .flow-step .cta-links { margin-top: 16px; }

      @media (max-width: 980px) {
        .hero, .split, .two-col, .comparison { grid-template-columns: 1fr; }
        .cards-3, .roadmap, .flow-diagram { grid-template-columns: 1fr 1fr; }
        .arrow { transform: rotate(90deg); min-height: 32px; }
      }
      @media (max-width: 680px) {
        .topbar-inner { align-items: flex-start; }
        .nav { display: none; }
        main { padding-inline: 16px; }
        .hero-copy, .panel, .profile-card { padding: 22px; }
        .cards-3, .roadmap, .flow-diagram, .metric-grid, .org-grid, .org-subgrid { grid-template-columns: 1fr; }
        h1 { font-size: 34px; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="#hero" aria-label="처음으로">
            <span class="mark">AX</span>
            <span>
              <small>Day1 Company CISO Interview</small>
              <b>이윤혁 | Founder, CISO, T-RIVE Leader</b>
            </span>
          </a>
          <nav class="nav" aria-label="발표 목차">
            <a href="#why">Why Day1</a>
            <a href="#leader">Leader</a>
            <a href="#ax">AX Security</a>
            <a href="#business">T-RIVE 확장</a>
            <a href="#roadmap">90 Days</a>
          </nav>
        </div>
      </header>

      <main>
        <!-- 1. Hero -->
        <section id="hero" class="hero">
          <div class="hero-copy">
            <div class="grid-overlay" aria-hidden="true"></div>
            <span class="eyebrow">CISO as Founder · Security as Growth System</span>
            <h1>저는 Day1 Company의 성장 속도를 지키는 AX 보안팀을 만들고 싶습니다.</h1>
            <p class="lead">
              안녕하세요. 창업가형 정보보호 리더 이윤혁입니다.
            </p>
            
            <div class="hero-toc">
              <p>오늘은 세 가지 관점에서 말씀드리겠습니다.</p>
              <ul>
                <li>첫째, 제가 왜 Day1의 현재 과제와 맞는 CISO인지.</li>
                <li>둘째, 당장 필요한 침해사고 대응을 어떻게 안정화할 것인지.</li>
                <li>셋째, 그 이후 Day1에 어떤 AX 보안팀과 확장 가능성을 만들 것인지입니다.</li>
              </ul>
            </div>
            
            <div class="hero-actions">
              <a class="button" href="#why">발표 시작하기</a>
            </div>
          </div>

          <aside class="hero-panel" aria-label="핵심 소개">
            <div class="profile-card">
              <span class="tag">Interview Narrative</span>
              <h2>창업가형 정보보호 리더</h2>
              <p>
                보안을 비용센터가 아니라 사업의 신뢰, 속도, 교육, 데이터 사업으로 확장하는 리더입니다.
              </p>
              <div class="tag-row">
                <span class="tag">CISO</span>
                <span class="tag">T-RIVE</span>
                <span class="tag">MONO</span>
                <span class="tag">Blood Star</span>
              </div>
            </div>
            <div class="metric-grid">
              <div class="metric-card">
                <b>Day 1</b>
                <span>침해사고 안정화 우선</span>
              </div>
              <div class="metric-card">
                <b>AX</b>
                <span>통제 가능한 리스크 지도</span>
              </div>
              <div class="metric-card">
                <b>T-RIVE</b>
                <span>팀 철학과 비전</span>
              </div>
              <div class="metric-card">
                <b>MONO</b>
                <span>산업 현장 운영 검증</span>
              </div>
            </div>
          </aside>
        </section>

        <!-- 2. Why Day1 -->
        <section id="why">
          <div class="section-head">
            <div>
              <h2>Why Day1</h2>
              <p>
                Day1에 합류하고 싶은 이유는 단순히 보안 조직을 운영하기 위해서가 아닙니다.<br>
                Day1이 교육과 콘텐츠, 플랫폼 사업을 확장하는 과정에서 보안이 신뢰와 속도를 동시에 설계하는 전략 기능이 될 수 있다고 보기 때문입니다.
              </p>
            </div>
          </div>

          <div class="cards-3">
            <article class="card">
              <span class="num">01</span>
              <h3>문화적 핏</h3>
              <p>Day1의 '첫번째 성공, 열번째 도전' 문화를 이해합니다. 보안을 이유로 속도를 늦추는 것이 아니라, 빠른 실험을 안전하게 지원하는 구조를 만들겠습니다.</p>
              <div class="cta-box" style="margin-top:auto">
                <div class="cta-links">
                  <a href="https://day1company.ninehire.site/dd" target="_blank" rel="noreferrer" class="button outline" style="width:100%; min-height: 36px; font-size:13px">Day1 채용 공고 상세 보기</a>
                </div>
              </div>
            </article>
            <article class="card">
              <span class="num">02</span>
              <h3>가장 잘 만들 수 있는 팀</h3>
              <p>사고 대응부터 정책, 개인정보, 클라우드, AI 거버넌스를 아우르는 역량으로 현업의 속도를 떨어뜨리지 않는 자율적 AX 보안팀을 만들 수 있습니다.</p>
              <div class="cta-box" style="margin-top:auto">
                <div class="cta-links">
                  <a href="https://dojiung.com/day1" target="_blank" rel="noreferrer" class="button outline" style="width:100%; min-height: 36px; font-size:13px">Day1 발표 허브 열기</a>
                </div>
              </div>
            </article>
            <article class="card">
              <span class="num">03</span>
              <h3>새로운 도전을 함께</h3>
              <p>제 T-RIVE 및 MONO 전략은 Day1의 Coloso 현장 기술자 교육 확장에 시너지를 내며, 이 과정에서 발생하는 리스크를 설계하는 데 기여합니다.</p>
            </article>
          </div>
        </section>

        <!-- 3. Founder-type CISO -->
        <section id="leader">
          <div class="section-head">
            <h2>Founder-type CISO</h2>
          </div>
          <div class="split">
            <div style="display:flex; flex-direction:column; gap:20px;">
              <div class="quote" style="flex-grow:1">
                <b>보안은 멈추게 하는 힘이 아니라, 더 멀리 가게 하는 신뢰의 구조입니다.</b>
                <p>위협을 막는 사람에서 사업의 구조를 설계하는 리더로 움직입니다.</p>
              </div>
              <div class="cta-box" style="margin-top:0;">
                <p>이 내용은 제가 보안 리더로서 어떤 관점과 경험을 가지고 있는지 설명하는 자료와 연결됩니다.</p>
                <div class="cta-links">
                  <a href="https://dojiung.com/security" target="_blank" rel="noreferrer" class="button outline" style="width:100%">CISO 경력 상세 보기</a>
                </div>
              </div>
            </div>
            
            <div class="panel">
              <ul class="list">
                <li>
                  <span class="dot"></span>
                  <div>
                    <strong>Incident Commander</strong>
                    <div style="font-weight: 600; color: var(--muted); margin-top: 6px; line-height: 1.5;">침해사고 대응, 재발 방지 대책 수립, 그리고 명확한 리스크 커뮤니케이션을 지휘합니다.</div>
                  </div>
                </li>
                <li style="margin-top: 14px;">
                  <span class="dot"></span>
                  <div>
                    <strong>Security Architect</strong>
                    <div style="font-weight: 600; color: var(--muted); margin-top: 6px; line-height: 1.5;">정책, 개인정보, 클라우드 인프라, 그리고 개발 파이프라인의 전사적 보안 구조를 설계합니다.</div>
                  </div>
                </li>
                <li style="margin-top: 14px;">
                  <span class="dot"></span>
                  <div>
                    <strong>Founder-type Leader</strong>
                    <div style="font-weight: 600; color: var(--muted); margin-top: 6px; line-height: 1.5;">사고 대응을 넘어, 보안을 Day1의 신사업(교육, B2B, 데이터) 확장을 위한 신뢰 인프라로 발전시킵니다.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 4. Day1 AX Security Team -->
        <section id="ax">
          <div class="section-head">
            <h2>Day1 AX 보안팀 설계</h2>
          </div>
          
          <div class="highlight-box">
            첫 번째 우선순위는 사고 대응입니다.<br>
            제가 제안드리는 AX 보안팀은 새로운 조직 이름을 붙이는 것이 목적이 아닙니다.<br>
            사고 대응으로 확인된 리스크를 업무 방식과 시스템 안에서 반복되지 않게 만들고,<br>
            AI와 SaaS 활용이 늘어나는 환경에서도 경영진이 통제 가능한 리스크 지도를 갖도록 만드는 것이 목적입니다.
          </div>

          <div class="comparison" style="margin-bottom: 24px;">
            <article class="card legacy" style="padding:20px;">
              <h3>Legacy Security</h3>
              <p>수동 점검, 사후 승인, 규정 중심 운영. 사고 대응과 안정화에는 필수적이나 병목이 발생할 수 있습니다.</p>
            </article>
            <div class="arrow">→</div>
            <article class="card future" style="padding:20px;">
              <h3>AX Security</h3>
              <p>AI 에이전트, 정책 가드레일, 셀프 서비스 기반 자동화. 현업이 안전하고 빠르게 일하게 돕습니다.</p>
            </article>
          </div>

          <div class="two-col">
            <div class="panel org">
              <div class="org-top">
                <button class="org-node selected" data-node="ciso">
                  <strong>CISO</strong>
                  <span>사고 대응, 보안 전략, 리스크 의사결정</span>
                </button>
              </div>
              <div class="org-grid">
                <button class="org-node" data-node="legacy">
                  <strong>Legacy 보안팀</strong>
                  <span>규제, 관제, 접근통제, 기존 운영 안정화</span>
                </button>
                <div>
                  <button class="org-node" data-node="axmain">
                    <strong>AX 보안팀</strong>
                    <span>AI Transformation 시대의 보안 운영체제</span>
                  </button>
                  <div class="org-subgrid">
                    <button class="org-node" data-node="policy"><strong>정책</strong><span>AI 가드레일</span></button>
                    <button class="org-node" data-node="privacy"><strong>개인정보</strong><span>데이터 최소화</span></button>
                    <button class="org-node" data-node="engineering"><strong>엔지니어링</strong><span>DevSecOps</span></button>
                    <button class="org-node" data-node="cloud"><strong>클라우드</strong><span>SaaS, CSPM</span></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel detail" id="org-detail" aria-live="polite">
              <h3>CISO</h3>
              <p>초기에는 침해사고 대응 지휘, 로그와 접근권한 정상화, 재발 방지 체계 수립에 집중합니다. 이후 AX 보안팀을 통해 보안을 제품화 가능한 운영체계로 확장합니다.</p>
              <ul class="list">
                <li><span class="dot"></span><span>긴급 대응 우선순위와 커뮤니케이션 체계 정렬</span></li>
                <li><span class="dot"></span><span>Day1의 사업 속도에 맞는 리스크 기준 수립</span></li>
                <li><span class="dot"></span><span>보안 챔피언과 AI 가상검수로 전사 확산</span></li>
              </ul>
              <div style="margin-top: 24px; padding: 12px; background: var(--soft); border-radius: 8px;">
                <strong>Day1 적용 효과:</strong>
                <p style="margin: 8px 0 0; font-size: 14px; font-weight: 600; color: var(--navy);">투명한 임원 보고 체계와 피해 확산 방지를 통해 고객 신뢰 하락을 최소화합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. T-RIVE / Blood Star / MONO 확장 전략 -->
        <section id="business">
          <div class="section-head">
            <div>
              <h2>비즈니스 확장 모델</h2>
              <p>
                T-RIVE와 MONO는 제가 Day1 밖에서 만든 별도 이야기가 아니라, 보안과 교육, 신뢰 데이터, 현장 운영을 어떻게 하나의 사업 구조로 연결해 보는지를 보여주는 실행 사례입니다.<br>
                Day1에서는 이 관점을 콜로소의 현장 기술자 교육 확장, B2B 파트너 관리, 개인정보와 신뢰 데이터 거버넌스로 연결할 수 있습니다.
              </p>
            </div>
          </div>
          
          <div class="flow-diagram">
            <div class="flow-step">
              <h3>1. T-RIVE 철학</h3>
              <p>각자의 성향에 맞는 팀을 구성하고 원팀으로 움직이는 유연한 조직 문화를 구축합니다.</p>
              <div class="cta-links">
                <a href="https://dojiung.com/creator/" target="_blank" rel="noreferrer" class="button outline" style="width:100%; min-height: 36px; font-size: 13px;">T-RIVE 팀 철학 보기</a>
              </div>
            </div>
            <div class="flow-step">
              <h3>2. MONO MVP</h3>
              <p>산업 현장 기술자의 신뢰 프로필을 구축하고 기업의 수요를 검증한 프로젝트입니다.</p>
              <div class="cta-links">
                <a href="https://mono.dojiung.com/mono" target="_blank" rel="noreferrer" class="button outline" style="width:100%; min-height: 36px; font-size: 13px;">MONO MVP 보기</a>
              </div>
            </div>
            <div class="flow-step">
              <h3>3. Coloso Field Tech</h3>
              <p>MONO의 현장 수요를 바탕으로, Coloso를 현장 기술자 직무 교육으로 확장할 수 있습니다.</p>
              <div class="cta-links">
                <a href="https://mono.dojiung.com/strategy" target="_blank" rel="noreferrer" class="button outline" style="width:100%; min-height: 36px; font-size: 13px;">MONO 전략 보기</a>
              </div>
            </div>
            <div class="flow-step">
              <h3>4. Blood Star & Day1</h3>
              <p>B2B 사업을 아우르는 신뢰/운영 인프라를 구축하고 Day1 AX 보안팀이 이를 통제합니다.</p>
            </div>
          </div>
        </section>

        <!-- 6. 90일 실행안 -->
        <section id="roadmap">
          <div class="section-head">
            <div>
              <h2>합류 후 90일 실행안 (First 90 Days)</h2>
              <p>초기 90일은 화려한 혁신보다 복구 가능한 기본기를 세우는 기간입니다. 사고 대응, 권한·로그 기준선, AI 가드레일, 경영진 리포팅 체계를 순서대로 만들겠습니다.</p>
            </div>
          </div>
          <div class="roadmap">
            <article class="card step">
              <small>Day 1-14</small>
              <h3>침해사고 안정화</h3>
              <p>산출물:<br>· 사고 타임라인<br>· 영향 범위 보고서<br>· 즉시 차단 조치 완료<br>· 임원 보고</p>
            </article>
            <article class="card step">
              <small>Day 15-30</small>
              <h3>보안 기준선 복구</h3>
              <p>산출물:<br>· 계정/권한 점검표<br>· SaaS 인벤토리<br>· 로그 보존 기준안 수립</p>
            </article>
            <article class="card step">
              <small>Day 31-60</small>
              <h3>AX 가드레일</h3>
              <p>산출물:<br>· AI 사용 정책<br>· 자동 보안검수 파이프라인 초안<br>· 보안 챔피언 운영안 기획</p>
            </article>
            <article class="card step">
              <small>Day 61-90</small>
              <h3>확장 전략 도출</h3>
              <p>산출물:<br>· 보안 KPI 설정<br>· 교육 사업 리스크 모델링<br>· Coloso 확장 방안 보안 검토서 작성</p>
            </article>
          </div>
        </section>

        <!-- 7. 마지막 메시지 -->
        <section id="outro">
          <div class="footer">
            <h2>감사합니다</h2>
            <p style="font-size: 20px; font-weight: 700; margin: 16px 0;">
              Day1 Company의 도전과 속도를 지키는<br>가장 든든한 AX 보안팀을 만들겠습니다.
            </p>
            <div class="tag" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 12px; display: inline-block;">
              CISO 이윤혁
            </div>
          </div>
        </section>

      </main>
    </div>

    <script>
      const details = {
        ciso: {
          title: "CISO",
          body: "초기에는 침해사고 대응 지휘, 로그와 접근권한 정상화, 재발 방지 체계 수립에 집중합니다. 이후 AX 보안팀을 통해 보안을 제품화 가능한 운영체계로 확장합니다.",
          items: ["긴급 대응 우선순위와 커뮤니케이션 체계 정렬", "Day1의 사업 속도에 맞는 리스크 기준 수립", "보안 챔피언과 AI 가상검수로 전사 확산"],
          effect: "투명한 임원 보고 체계와 피해 확산 방지를 통해 고객 신뢰 하락을 최소화합니다."
        },
        legacy: {
          title: "Legacy 보안팀",
          body: "기존 인프라, 접근권한, 규제 대응, 관제 업무를 안정화합니다. 반복 업무는 표준화하고 자동화 후보를 발굴해 AX 팀으로 넘깁니다.",
          items: ["사고 대응 런북과 증적 관리", "계정, 권한, SaaS, 엔드포인트 기준선", "ISMS-P와 개인정보 컴플라이언스 운영"],
          effect: "기초적인 보안 홀(Hole)을 메워, 동일한 패턴의 보안 사고 재발을 원천 차단합니다."
        },
        axmain: {
          title: "AX 보안팀",
          body: "AI Transformation에 맞는 정책, 엔지니어링, 클라우드, 개인정보 보호를 한 팀으로 묶습니다. 목적은 차단이 아니라 안전한 기본 경로를 만드는 것입니다.",
          items: ["AI 도구 사용 가드레일", "자동 보안검수와 챔피언 프로그램", "제품·교육·B2B 확장 리스크 설계"],
          effect: "실무자가 보안팀을 거치지 않고도 안전하게 일할 수 있는 셀프 서비스(Self-Service) 보안 환경을 구축하여 Day1의 개발 속도를 높입니다."
        },
        policy: {
          title: "정책 & 거버넌스",
          body: "임직원이 AI와 신규 SaaS를 안전하게 쓰도록 승인 절차를 줄이고, 데이터 등급과 사용 가능 범위를 명확하게 설계합니다.",
          items: ["AI 사용 정책", "Shadow AI 양성화", "현업 친화형 승인 기준"],
          effect: "빠른 사내 AI 도입과 활용을 안전하게 지원합니다."
        },
        privacy: {
          title: "개인정보 보호",
          body: "교육 플랫폼과 B2B 사업 확장에 필요한 개인정보 흐름을 정리하고, 최소 수집, 목적 제한, 위탁·제3자 제공 관리를 제품 흐름에 심습니다.",
          items: ["개인정보 처리 맵", "고위험 처리 사전검토", "교육 데이터 보호 기준"],
          effect: "데이터 활용도를 높이면서도 잠재적인 과징금 리스크를 낮춥니다."
        },
        engineering: {
          title: "보안 엔지니어링",
          body: "개발 파이프라인, 코드, API, 배포 흐름에 자동 보안검수를 붙여 보안팀의 수동 검토 병목을 줄입니다.",
          items: ["DevSecOps 기본선", "자동 취약점 triage", "보안성 심사 5분 모델"],
          effect: "개발 조직의 배포 속도에 맞춰 보안이 실시간으로 따라갑니다."
        },
        cloud: {
          title: "클라우드 보안",
          body: "클라우드와 SaaS 노출면을 지속적으로 파악하고, 잘못된 설정과 과도한 권한을 자동 감지하도록 만듭니다.",
          items: ["CSPM 기준선", "SaaS 보안 인벤토리", "권한·키·비밀정보 관리"],
          effect: "휴먼 에러로 인한 클라우드 유출 사고를 시스템 레벨에서 예방합니다."
        }
      };

      const detail = document.querySelector("#org-detail");
      const nodes = document.querySelectorAll("[data-node]");

      function renderDetail(key) {
        const data = details[key] || details.ciso;
        nodes.forEach((node) => node.classList.toggle("selected", node.dataset.node === key));
        detail.innerHTML =
          "<h3>" + data.title + "</h3>" +
          "<p>" + data.body + "</p>" +
          "<ul class='list'>" +
          data.items.map((item) => "<li><span class='dot'></span><span>" + item + "</span></li>").join("") +
          "</ul>" +
          "<div style='margin-top: 24px; padding: 12px; background: var(--soft); border-radius: 8px;'>" +
          "<strong>Day1 적용 효과:</strong>" +
          "<p style='margin: 8px 0 0; font-size: 14px; font-weight: 600; color: var(--navy);'>" + (data.effect || "") + "</p>" +
          "</div>";
      }

      nodes.forEach((node) => {
        node.addEventListener("click", () => renderDetail(node.dataset.node));
      });

      const anchors = ["hero", "why", "leader", "ax", "business", "roadmap", "outro"];
      window.addEventListener("keydown", (event) => {
        const index = Number(event.key) - 1;
        if (index >= 0 && index < anchors.length) {
          document.getElementById(anchors[index]).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      const navLinks = Array.from(document.querySelectorAll(".nav a"));
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        });
      }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
      anchors.forEach((id) => {
        const el = document.getElementById(id);
        if(el) observer.observe(el);
      });
    </script>
  </body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    void env;
    void ctx;

    const url = new URL(request.url);
    if (url.pathname !== "/") {
      return new Response("Not found", { status: 404 });
    }

    return new Response(page, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
