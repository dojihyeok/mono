'use client';

import React from 'react';
import Image from 'next/image';
import styles from './OccupationGrid.module.css';

import { CATEGORY_LABELS } from '@/constants/jobs';

interface Master {
    id: string;
    name: string;
    en: string;
    image: string;
    specialty: string;
}

interface CategoryGroup {
    category: string;
    description: string;
    masters: Master[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        category: '1. Heavy-Tech',
        description: CATEGORY_LABELS['1. Heavy-Tech'],
        masters: [
            { id: 'tiler', name: '타일공', en: 'TILER', image: '/images/occupations/tiler_v3.png', specialty: '타일' },
            { id: 'welder', name: '용접공', en: 'WELDER', image: '/images/occupations/welder_v3.png', specialty: '용접' },
            { id: 'plumber', name: '배관공', en: 'PLUMBER', image: '/images/occupations/plumber_v3.png', specialty: '배관' },
            { id: 'carpenter', name: '목수', en: 'CARPENTER', image: '/images/occupations/carpenter_v3.png', specialty: '목수' },
            { id: 'scaffolder', name: '비계공', en: 'SCAFFOLDER', image: '/images/occupations/scaffolder_v3.png', specialty: '비계' },
            { id: 'glazier', name: '창호 시공', en: 'WINDOW INSTALLER', image: '/images/occupations/glazier_v3.png', specialty: '창호' },
            { id: 'waterproofing', name: '방수 시공', en: 'WATERPROOFING', image: '/images/occupations/waterproofing_v3.png', specialty: '방수' },
            { id: 'painter', name: '도장공', en: 'PAINTER', image: '/images/occupations/painter_v3.png', specialty: '도장' },
        ]
    },
    {
        category: '2. Equipment',
        description: CATEGORY_LABELS['2. Equipment'],
        masters: [
            { id: 'road', name: '도로 포장', en: 'ROAD PAVER', image: '/images/occupations/road_v3.png', specialty: '토목' },
            { id: 'aircraft', name: '항공 정비', en: 'AIRCRAFT MECHANIC', image: '/images/occupations/aircraft_v3.png', specialty: '정비' },
        ]
    },
    {
        category: '3. E-Tech & IT',
        description: CATEGORY_LABELS['3. E-Tech & IT'],
        masters: [
            { id: 'electrician', name: '전기 기술자', en: 'ELECTRICIAN', image: '/images/occupations/electrician_v3.png', specialty: '전기' },
            { id: 'industrial', name: '산업 설비', en: 'INDUSTRIAL MAINTENANCE', image: '/images/occupations/industrial_v3.png', specialty: '설비유지보수' },
        ]
    },
    {
        category: '4. Agri/Eco-Tech',
        description: CATEGORY_LABELS['4. Agri/Eco-Tech'],
        masters: [
            { id: 'drone', name: '드론 방제 마스터', en: 'DRONE MASTER', image: '/images/occupations/drone_master_v3.png', specialty: '드론방제' },
        ]
    },
    {
        category: '5. Ocean-Tech',
        description: CATEGORY_LABELS['5. Ocean-Tech'],
        masters: [
            { id: 'underwater_welder', name: '수중 용접 마스터', en: 'UNDERWATER WELDER', image: '/images/occupations/underwater_welder_v3.png', specialty: '수중용접' },
        ]
    },
    {
        category: '6. Life/Home-Care',
        description: CATEGORY_LABELS['6. Life/Home-Care'],
        masters: [
            { id: 'homecare', name: '에어컨 분해청소', en: 'A/C SPECIALIST', image: '/images/occupations/homecare_specialist_v3.png', specialty: '에어컨분해청소' },
        ]
    },
    {
        category: '7. Safety & Support',
        description: CATEGORY_LABELS['7. Safety & Support'],
        masters: [
            { id: 'safety_supervisor', name: '안전 관리 보조', en: 'SAFETY SUPERVISOR', image: '/images/occupations/occ_safety_supervisor_v3.png', specialty: '안전관리보조' },
            { id: 'signal_person', name: '신호수', en: 'SIGNAL MASTER', image: '/images/occupations/occ_signal_person_v3.png', specialty: '신호수' },
            { id: 'helper', name: '일반 조공 / 헬퍼', en: 'ASSISTANT MASTER', image: '/images/occupations/occ_helper_v3.png', specialty: '일반조공(헬퍼)' },
        ]
    },
    {
        category: '8. Professional Support',
        description: '현장 운영 및 소통 마케팅 지원',
        masters: [
            { id: 'seo-jeong-feel-good', name: '서정필굿', en: 'FEEL GOOD MASTER', image: '/images/occupations/welder_v3.png', specialty: '현장 운영 및 소통 전문가' },
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

    // Deterministic random count based on id string to maintain stability
    const getCount = (id: string) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 15) + 5;
    };

    return (
        <div className={styles.container}>
            {CATEGORY_GROUPS.map((group) => (
                <div key={group.category} className={`${styles.section} fade-up`}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.categoryTitle}>{group.category}</h2>
                        <span className={styles.categoryDesc}>{group.description}</span>
                    </div>
                    <div className={styles.grid}>
                        {group.masters.length > 0 ? (
                            group.masters.map((occ) => (
                                <div key={occ.id} className={styles.tile} onClick={() => onSelect(occ.specialty)}>
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={occ.image}
                                            alt={occ.name}
                                            width={120}
                                            height={120}
                                            className={styles.image}
                                        />
                                        {isMounted && (
                                            <div className={styles.countBadge}>
                                                {getCount(occ.id)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.labelGroup}>
                                        <span className={styles.name}>{occ.name}</span>
                                        <div className={styles.metaRow}>
                                            <span className={styles.en}>{occ.en}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.placeholderCard}>
                                <span>100대 마스터 직군 준비 중</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
