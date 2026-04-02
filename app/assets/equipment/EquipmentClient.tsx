'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
    Truck, 
    Settings, 
    Calendar, 
    Activity, 
    ShieldCheck, 
    HardHat, 
    Plus, 
    Zap, 
    Construction,
    Wrench,
    ArrowUpRight,
    Clock
} from 'lucide-react';

const EQUIPMENT_DATA = [
    {
        id: 'EQ-091',
        name: 'Komatsu PC200-11',
        type: 'Excavator (20t)',
        runningHours: '1,240h',
        status: 'Optimal',
        nextService: '2024.06.10',
        valuation: '₩ 185,000,000',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?w=500&q=80',
        health: 98
    },
    {
        id: 'EQ-042',
        name: 'DJI Agras T40',
        type: 'Agricultural Drone',
        runningHours: '450h',
        status: 'Needs Service',
        nextService: '2024.04.15',
        valuation: '₩ 24,000,000',
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&q=80',
        health: 72
    }
];

export default function EquipmentClient() {
    return (
        <div className={styles.container}>
            {/* Equipment Hub Header */}
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>EQUIPMENT & ASSETS</h1>
                    <p>마스터의 강력한 도구, 최고의 컨디션으로 관리하세요.</p>
                </div>
                <button className={styles.addBtn} style={{ background: '#E2E8F0', color: '#020204' }}>
                    <Plus size={16} />
                    장비 등록
                </button>
            </header>

            {/* Total Asset Valuation Summary */}
            <section className={styles.valuationSummary}>
                <div className={styles.summaryContent}>
                    <span>TOTAL EQUIPMENT VALUE</span>
                    <strong>₩ 209,000,000</strong>
                </div>
                <div className={styles.valuationBadge}>
                    <Zap size={12} color="#ffd700" />
                    Market Value Verified
                </div>
            </section>

            {/* Equipment List Grid */}
            <section className={styles.equipmentGrid}>
                {EQUIPMENT_DATA.map(eq => (
                    <div key={eq.id} className={styles.equipmentCard}>
                        <div className={styles.imageOverlay}>
                            <img src={eq.image} alt={eq.name} />
                            <div className={styles.statusBadge} data-status={eq.status}>
                                {eq.status}
                            </div>
                        </div>
                        
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <div className={styles.mainTitle}>
                                    <h3>{eq.name}</h3>
                                    <span>{eq.type}</span>
                                </div>
                                <div className={styles.healthScore}>
                                    <Activity size={14} color={eq.health > 80 ? '#4cd964' : '#ff9500'} />
                                    <strong style={{ color: eq.health > 80 ? '#4cd964' : '#ff9500' }}>{eq.health}%</strong>
                                </div>
                            </div>

                            <div className={styles.statsRow}>
                                <div className={styles.statItem}>
                                    <Clock size={12} />
                                    <span>{eq.runningHours}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <Calendar size={12} />
                                    <span>Next: {eq.nextService}</span>
                                </div>
                            </div>

                            <div className={styles.valuationRow}>
                                <span>Estimated Market Value</span>
                                <strong>{eq.valuation}</strong>
                            </div>

                            <div className={styles.cardActions}>
                                <button className={styles.utilBtn}>
                                    <Wrench size={14} />
                                    Service Log
                                </button>
                                <button className={styles.utilBtn}>
                                    <ArrowUpRight size={14} />
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Team Assets Preview */}
            <section className={styles.teamSection}>
                <div className={styles.teamHeader}>
                    <h2>ACTIVE MASTER TEAM</h2>
                    <span>TEAM SYNERGY: <strong>94%</strong></span>
                </div>
                <div className={styles.teamAvatars}>
                    <div className={styles.avatarBox}><img src="https://i.pravatar.cc/100?u=1" alt="T1" /></div>
                    <div className={styles.avatarBox}><img src="https://i.pravatar.cc/100?u=2" alt="T2" /></div>
                    <div className={styles.avatarBox}><img src="https://i.pravatar.cc/100?u=3" alt="T3" /></div>
                    <div className={styles.avatarAdd}>+4</div>
                </div>
                <p>총 7명의 마스터가 원 히트 팀(One Hit Team)으로 협업 중입니다.</p>
                <button className={styles.teamManageBtn}>팀 자금 및 로그 관리</button>
            </section>
        </div>
    );
}
