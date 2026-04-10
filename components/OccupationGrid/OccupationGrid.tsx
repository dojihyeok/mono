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

interface Master {
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
    masters: Master[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        category: '1. Heavy-Tech',
        description: '건설 / 건축 / 인테리어 전문 기술',
        masters: [
            { id: 'tiler', name: '타일공', en: 'TILER', icon: <LayoutGrid size={32} />, specialty: '타일' },
            { id: 'welder', name: '용접공', en: 'WELDER', icon: <Flame size={32} />, specialty: '용접' },
            { id: 'plumber', name: '배관공', en: 'PLUMBER', icon: <Droplets size={32} />, specialty: '배관' },
            { id: 'carpenter', name: '목수', en: 'CARPENTER', icon: <Hammer size={32} />, specialty: '목수' },
            { id: 'scaffolder', name: '비계공', en: 'SCAFFOLDER', icon: <Layers size={32} />, specialty: '비계' },
            { id: 'glazier', name: '창호 시공', en: 'WINDOW INSTALLER', icon: <Maximize size={32} />, specialty: '창호' },
            { id: 'waterproofing', name: '방수 시공', en: 'WATERPROOFING', icon: <Umbrella size={32} />, specialty: '방수' },
            { id: 'painter', name: '도장공', en: 'PAINTER', icon: <PaintRoller size={32} />, specialty: '도장' },
        ]
    },
    {
        category: '2. Equipment',
        description: '중장비 / 운송 / 정비',
        masters: [
            { id: 'road', name: '도로 포장', en: 'ROAD PAVER', icon: <HardHat size={32} />, specialty: '토목' },
            { id: 'aircraft', name: '항공 정비', en: 'AIRCRAFT MECHANIC', icon: <Plane size={32} />, specialty: '정비' },
        ]
    },
    {
        category: '3. E-Tech & IT',
        description: '디지털 및 전기 자동화 기술',
        masters: [
            { id: 'electrician', name: '전기 기술자', en: 'ELECTRICIAN', icon: <Zap size={32} />, specialty: '전기' },
            { id: 'industrial', name: '산업 설비', en: 'INDUSTRIAL MAINTENANCE', icon: <Settings size={32} />, specialty: '설비유지보수' },
        ]
    },
    {
        category: '4. Agri/Eco-Tech',
        description: '드론 및 친환경 스마트 팜',
        masters: [
            { id: 'drone', name: '드론 방제', en: 'DRONE MASTER', icon: <Radio size={32} />, specialty: '드론방제' },
        ]
    },
    {
        category: '5. Ocean-Tech',
        description: '해양 플랜트 및 수중 기술',
        masters: [
            { id: 'underwater_welder', name: '수중 용접', en: 'UNDERWATER WELDER', icon: <Waves size={32} />, specialty: '수중용접' },
        ]
    },
    {
        category: '7. Safety & Support',
        description: '현장 안전 및 운영 지원',
        masters: [
            { id: 'safety_supervisor', name: '안전 관리', en: 'SAFETY SUPERVISOR', icon: <ShieldCheck size={32} />, specialty: '안전관리보조' },
            { id: 'signal_person', name: '신호수', en: 'SIGNAL MASTER', icon: <Megaphone size={32} />, specialty: '신호수' },
            { id: 'helper', name: '일반 조공', en: 'ASSISTANT', icon: <HandHelping size={32} />, specialty: '일반조공(헬퍼)' },
        ]
    },
    {
        category: '8. Professional',
        description: '현장 운영 및 소통 마케팅 지원',
        masters: [
            { id: 'seo-jeong-feel-good', name: '서정필굿', en: 'FEEL GOOD', icon: <Heart size={32} />, specialty: '현장 운영' },
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
                        {group.masters.map((occ) => (
                            <div key={occ.id} className={styles.tile} onClick={() => onSelect(occ.specialty)}>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconOverlay} />
                                    {occ.icon}
                                    {isMounted && (
                                        <div className={styles.countBadge}>
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
