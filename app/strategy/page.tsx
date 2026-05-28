import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import StrategyClient from './StrategyClient';

export const metadata: Metadata = {
  title: "MONO · 현장의 땀방울이 데이터가 되는 미래, Next MONO 통합 전략서",
  description: "MONO 6막 통합 전략서 — The Platform · The Life Cycle · Problem & Solution · Tournament Strategy · Business Model & Valuation · The Next MONO Vision.",
};

export default function StrategyPage() {
  const filePath = path.join(process.cwd(), 'public', 'pitch.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  // 서버사이드에서 pitch.html을 읽어 클라이언트 컴포넌트로 전달합니다.
  return <StrategyClient htmlContent={htmlContent} />;
}
