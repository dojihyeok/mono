import TechcardShareClient from './TechcardShareClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'MoNo 기술카드 공식 증명서',
    description: '검증된 업무 이력 및 안전 교육 통과 증명서',
};

export default function TechcardSharePage() {
    return <TechcardShareClient />;
}
