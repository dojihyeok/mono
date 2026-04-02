import EquipmentClient from './EquipmentClient';

export const metadata = {
    title: 'Equipment & Team Assets | MO-NO Masters',
    description: '마스터의 전문 장비 및 팀 자산 통합 관리 센터. 장비 제원, 정비 이력, 시장 가치 평가 및 팀 시너지 스코어 시각화.',
};

export default function EquipmentPage() {
    return <EquipmentClient />;
}
