import Image from 'next/image';
import styles from './field-pass-v2.module.css';
import { versionedImage } from './imageVersions';

// Section 01 — Hero. 텍스트(위) → 이미지(아래) 세로 구조, 이미지는 16:9 유지.
export function FieldPassHero({ onCtaClick }: { onCtaClick?: () => void }) {
  return (
    <section className={styles.section} style={{ paddingBottom: 96 }}>
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader} style={{ marginBottom: 48 }}>
          <p className={styles.eyebrow}>CONSTRUCTION WORKFORCE CREDENTIAL</p>
          <h1 className={styles.sectionTitle} style={{ fontSize: 'clamp(28px, 4.4vw, 48px)' }}>
            건설 인증의 다음 경험을 함께 만듭니다.
          </h1>
          <p className={styles.sectionDescription}>
            건설올패스의 공적 기록과 MONO의 현장 경험,
            <br />
            SSenStone의 인증 기술을 하나의 흐름으로 연결합니다.
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.ctaPrimary} onClick={onCtaClick}>
              함께 만드는 Field Pass
            </button>
          </div>
        </header>
        <div className={styles.visualFrame}>
          <Image
            src={versionedImage('/images/field-pass/01_Hero_Bridge_1920x1080.png')}
            alt="건설올패스와 MONO App, SSenStone이 MONO Field Pass로 연결되는 공동 비전"
            width={1920}
            height={1080}
            sizes="(max-width: 767px) 92vw, (max-width: 1023px) 640px, 920px"
            priority
            className={styles.visual}
          />
        </div>
      </div>
    </section>
  );
}
