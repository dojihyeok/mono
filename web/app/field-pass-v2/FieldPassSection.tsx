import styles from './field-pass-v2.module.css';

export function FieldPassSection({
  id,
  dark,
  tight,
  chapter,
  eyebrow,
  title,
  description,
  centered,
  onView,
  children,
}: {
  id?: string;
  dark?: boolean;
  tight?: boolean;
  chapter?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  centered?: boolean;
  onView?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      onMouseEnter={onView}
      className={`${tight ? styles.sectionTight : styles.section} ${dark ? styles.dark : ''}`}
    >
      <div className={styles.container}>
        {(chapter || eyebrow || title || description) && (
          <div className={styles.sectionHead} style={centered ? { margin: '0 auto 56px', textAlign: 'center', maxWidth: 640 } : undefined}>
            {chapter && (
              <div style={{ fontSize: 12, fontWeight: 900, color: dark ? 'rgba(226,232,240,0.5)' : '#94a3b8', letterSpacing: '0.14em', marginBottom: 10 }}>
                {chapter.toUpperCase()}
              </div>
            )}
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
