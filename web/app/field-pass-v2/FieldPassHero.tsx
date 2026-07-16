import styles from './field-pass-v2.module.css';
import { COLOR } from './graphicPrimitives';

export function FieldPassHero() {
  return (
    <section className={styles.section} style={{ paddingTop: 120, paddingBottom: 60, textAlign: 'center' }}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>MONO FIELD PASS INITIATIVE</span>
        <h1 style={{ margin: '0 auto', fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.12, wordBreak: 'keep-all' }}>
          MONO Field Pass
        </h1>
        <div style={{ marginTop: 12, fontSize: 'clamp(14px, 2vw, 19px)', fontWeight: 750, color: COLOR.indigo }}>
          Building the Next Construction Credential
        </div>
        <p style={{ margin: '24px auto 0', maxWidth: 560, fontSize: 17, fontWeight: 650, lineHeight: 1.9, color: '#334155', wordBreak: 'keep-all' }}>
          건설올패스의 공적 기록과 MONO 앱의 현장 인증 경험을 연결하여
          <br />
          차세대 현장 인증을 만들어갑니다.
        </p>
      </div>
    </section>
  );
}
