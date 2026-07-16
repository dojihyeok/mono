import styles from './field-pass-v2.module.css';

// 페이지 마지막 클로징 — 화면 하나, 엄청 크게. MONO × SENSTONE.
export function TogetherFinale() {
  return (
    <section
      style={{
        background: '#0f172a',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
      }}
    >
      <div style={{ fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: 950, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
        MONO
        <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 20px' }}>×</span>
        SENSTONE
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 'clamp(20px, 3.4vw, 34px)',
          fontWeight: 850,
          color: 'rgba(226,232,240,0.9)',
          lineHeight: 1.5,
          wordBreak: 'keep-all',
          maxWidth: 760,
        }}
      >
        Let&apos;s Build
        <br />
        The Next Construction Credential
        <br />
        Together.
      </div>
      <div className={styles.ctaRow}>
        <a href="mailto:yunhyeok@t-rive.com?subject=MONO%20Field%20Pass%20Initiative%20%EA%B3%B5%EB%8F%99%20%EC%A0%9C%EC%95%88" className={styles.ctaPrimary}>
          함께 만들기
        </a>
      </div>
    </section>
  );
}
