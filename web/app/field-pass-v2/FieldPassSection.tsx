import Image from 'next/image';
import styles from './field-pass-v2.module.css';

export type FieldPassSectionProps = {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
  theme?: 'light' | 'soft' | 'dark';
  onView?: () => void;
};

// 9개 섹션 공통 구조 — 큰 제목 + 짧은 설명 + 큰 인포그래픽(PNG) 하나.
// 이미지 내용을 JSX 다이어그램/아이콘으로 다시 그리지 않는다.
export function FieldPassSection({
  id,
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  priority = false,
  theme = 'light',
  onView,
}: FieldPassSectionProps) {
  return (
    <section id={id} className={styles.section} data-theme={theme} onMouseEnter={onView}>
      <div className={styles.sectionInner}>
        <header className={styles.sectionHeader}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionDescription}>{description}</p>
        </header>
        <div className={styles.visualFrame}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1920}
            height={1080}
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 92vw, 1440px"
            priority={priority}
            className={styles.visual}
          />
        </div>
      </div>
    </section>
  );
}
