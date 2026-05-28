import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "MONO · 현장의 땀방울이 데이터가 되는 미래, Next MONO 통합 전략서",
  description: "MONO 6막 통합 전략서 — The Platform · The Life Cycle · Problem & Solution · Tournament Strategy · Business Model & Valuation · The Next MONO Vision.",
};

export default function StrategyPage() {
  const filePath = path.join(process.cwd(), 'public', 'pitch.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  // dangerouslySetInnerHTML을 사용하여 pitch.html 내용을 /strategy 경로에서 온전히 렌더링합니다.
  // Next.js 클라이언트 사이드 네비게이션과 브라우저 직접 접속 모두 완벽히 호환됩니다.
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
      style={{ width: '100%', minHeight: '100vh' }}
    />
  );
}
