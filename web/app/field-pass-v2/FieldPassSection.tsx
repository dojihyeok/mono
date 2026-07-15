import styles from './field-pass-v2.module.css';

export function FieldPassSection({
  id,
  dark,
  tight,
  eyebrow,
  title,
  description,
  onView,
  children,
}: {
  id?: string;
  dark?: boolean;
  tight?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
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
        {(eyebrow || title || description) && (
          <div className={styles.sectionHead}>
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
