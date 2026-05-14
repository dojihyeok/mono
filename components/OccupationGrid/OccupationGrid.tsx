'use client';

import React from 'react';
import styles from './OccupationGrid.module.css';
import { 
    LayoutGrid, 
    Flame, 
    Droplets, 
    Hammer, 
    Layers, 
    Maximize, 
    Umbrella, 
    PaintRoller, 
    HardHat, 
    Plane, 
    Zap, 
    Settings, 
    Radio, 
    Waves, 
    Wind, 
    ShieldCheck, 
    Megaphone, 
    HandHelping, 
    Heart,
    Cpu,
    Boxes
} from 'lucide-react';

interface Expert {
    id: string;
    name: string;
    en: string;
    icon: React.ReactNode;
    specialty: string;
    color?: string;
}

interface CategoryGroup {
    category: string;
    description: string;
    experts: Expert[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        category: '1. 건설·건축 전문',
        description: '골조 및 마감 전문 기술직군',
        experts: [
            { id: 'tiler', name: '타일공', en: 'TILER', icon: <LayoutGrid size={32} />, specialty: '타일' },
            { id: 'welder', name: '용접공', en: 'WELDER', icon: <Flame size={32} />, specialty: '용접' },
            { id: 'plumber', name: '배관공', en: 'PLUMBER', icon: <Droplets size={32} />, specialty: '배관' },
            { id: 'carpenter', name: '목수', en: 'CARPENTER', icon: <Hammer size={32} />, specialty: '목수' },
            { id: 'scaffolder', name: '비계공', en: 'SCAFFOLDER', icon: <Layers size={32} />, specialty: '비계' },
            { id: 'glazier', name: '창호 시공', en: 'WINDOW', icon: <Maximize size={32} />, specialty: '창호' },
            { id: 'waterproofing', name: '방수 시공', en: 'WATERPROOF', icon: <Umbrella size={32} />, specialty: '방수' },
            { id: 'painter', name: '도장공', en: 'PAINTER', icon: <PaintRoller size={32} />, specialty: '도장' },
        ]
    },
    {
        category: '2. 중장비 및 운송',
        description: '특수 장비 조종 및 정비',
        experts: [
            { id: 'road', name: '도로 포장', en: 'PAVER', icon: <HardHat size={32} />, specialty: '토목' },
            { id: 'aircraft', name: '항공 정비', en: 'MECHANIC', icon: <Plane size={32} />, specialty: '정비' },
        ]
    },
    {
        category: '3. 전기 및 설비',
        description: '디지털, 자동화 및 유지보수',
        experts: [
            { id: 'electrician', name: '전기 기술자', en: 'ELECTRICIAN', icon: <Zap size={32} />, specialty: '전기' },
            { id: 'industrial', name: '산업 설비', en: 'INDUSTRIAL', icon: <Settings size={32} />, specialty: '설비유지보수' },
        ]
    },
    {
        category: '4. 농업 및 드론',
        description: '드론 방제 및 스마트 기술',
        experts: [
            { id: 'drone', name: '드론 방제', en: 'DRONE', icon: <Radio size={32} />, specialty: '드론방제' },
        ]
    },
    {
        category: '5. 수중 및 해양',
        description: '수중 구조물 및 플랜트 작업',
        experts: [
            { id: 'underwater_welder', name: '수중 용접', en: 'UNDERWATER', icon: <Waves size={32} />, specialty: '수중용접' },
        ]
    },
    {
        category: '6. 현장 안전 및 지원',
        description: '안전 관리 및 운영 보조',
        experts: [
            { id: 'safety_supervisor', name: '안전 관리', en: 'SAFETY', icon: <ShieldCheck size={32} />, specialty: '안전관리보조' },
            { id: 'signal_person', name: '신호수', en: 'SIGNAL', icon: <Megaphone size={32} />, specialty: '신호수' },
            { id: 'helper', name: '일반 조공', en: 'ASSISTANT', icon: <HandHelping size={32} />, specialty: '일반조공(헬퍼)' },
        ]
    },
    {
        category: '7. 운영 및 마케팅',
        description: '현장 소통 및 브랜드 홍보',
        experts: [
            { id: 'seo-jeong-feel-good', name: '서정필굿', en: 'MARKETING', icon: <Heart size={32} />, specialty: '현장 운영' },
        ]
    }
];

interface OccupationGridProps {
    onSelect: (specialty: string) => void;
}

export default function OccupationGrid({ onSelect }: OccupationGridProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const getCount = (id: string) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 15) + 5;
    };

    return (
        <div className={styles.container}>
            {CATEGORY_GROUPS.map((group) => (
                <div key={group.category} className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.glowTop} />
                        <h2 className={styles.categoryTitle}>{group.category}</h2>
                        <span className={styles.categoryDesc}>{group.description}</span>
                    </div>
                    <div className={styles.grid}>
                        {group.experts.map((occ) => (
                            <div key={occ.id} className={styles.tile} onClick={() => onSelect(occ.specialty)}>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconOverlay} />
                                    {occ.icon}
                                    {isMounted && (
                                        <div className={`${styles.countBadge} ${styles.pulseBadge}`}>
                                            {getCount(occ.id)}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.labelGroup}>
                                    <span className={styles.name}>{occ.name}</span>
                                    <span className={styles.en}>{occ.en}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
