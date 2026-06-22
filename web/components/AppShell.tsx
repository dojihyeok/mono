import styles from "./AppShell.module.css";

// 사용자 앱 셸 — 웹+앱 하이브리드(PWA/웹뷰)용 모바일 프레임.
// 모바일: 풀스크린 / 데스크톱: 가운데 '폰 프레임' (반응형) + safe-area.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.viewport}>
      <div className={styles.frame}>{children}</div>
    </div>
  );
}
