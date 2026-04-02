'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
    Globe, 
    Share2, 
    Download, 
    ShieldCheck, 
    PlaneLanding, 
    CreditCard, 
    FileText,
    CheckCircle2,
    Lock,
    Settings,
    ArrowUpRight,
    Map
} from 'lucide-react';

const GLOBAL_REPORT_DATA = {
    userName: 'KIM MASTER',
    role: 'Tier 1 Tiler & Layout Expert',
    certifiedBy: 'MO-NO Global Agency',
    score: 96,
    trustRank: 'Master (Global Top 5%)',
    verifiedProjects: 142,
    isoStandard: 'ISO 20001:2024 Optimized'
};

const COUNTRIES = [
    { id: 'aus', name: 'Australia', flag: '🇦🇺', visa: '482/186 PR', status: 'Ready to Apply', color: '#012169' },
    { id: 'can', name: 'Canada', flag: '🇨🇦', visa: 'Red Seal / EE', status: 'In Progress (70%)', color: '#FF0000' },
    { id: 'ger', name: 'Germany', flag: '🇩🇪', visa: 'Chancenkarte', status: 'Requirements Missing', color: '#FFCE00' }
];

const PASSPORT_TILES = [
    { id: 'log', title: 'ISO Career Report', icon: <FileText />, desc: '국제 표준 영문 경력증명서', action: 'Download' },
    { id: 'rpl', title: 'RPL Certification', icon: <ShieldCheck />, desc: '호주 자격 전환 완료', action: 'Verified' },
    { id: 'eng', title: 'Tech English', icon: <Globe />, desc: 'IELTS 6.5 / PTE 58+', action: 'Check' },
    { id: 'ins', title: 'Global Insurance', icon: <CreditCard />, desc: '상해/생명 보험 활성화', action: 'Active' }
];

export default function PassportClient() {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

    return (
        <div className={styles.container}>
            {/* Header with Glassmorphic Card */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <Globe size={24} className={styles.globeSpin} />
                    <div className={styles.profileMeta}>
                        <h2>GLOBAL MASTER PASSPORT</h2>
                        <span>{GLOBAL_REPORT_DATA.isoStandard}</span>
                    </div>
                    <Share2 size={24} className={styles.iconBtn} />
                </div>
                
                <div className={styles.masterIdCard}>
                    <div className={styles.cardGlow} />
                    <div className={styles.cardHeader}>
                        <div className={styles.idPhoto}>
                            <img src="https://images.unsplash.com/photo-1548690312-e3b507d17a4d?w=200&q=80" alt="Master" />
                            <div className={styles.verifiedBadge}>✓</div>
                        </div>
                        <div className={styles.idInfo}>
                            <div className={styles.nameSection}>
                                <h3>{GLOBAL_REPORT_DATA.userName}</h3>
                                <span className={styles.roleTag}>{GLOBAL_REPORT_DATA.role}</span>
                            </div>
                            <div className={styles.scoreSection}>
                                <div className={styles.scoreRow}>
                                    <span>TRUST SCORE</span>
                                    <strong>{GLOBAL_REPORT_DATA.score}</strong>
                                </div>
                                <div className={styles.rankBadge}>{GLOBAL_REPORT_DATA.trustRank}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.cardStats}>
                        <div className={styles.statItem}>
                            <span>LOGS</span>
                            <strong>1.4k+ hr</strong>
                        </div>
                        <div className={styles.statLine} />
                        <div className={styles.statItem}>
                            <span>PROJECTS</span>
                            <strong>142 Cases</strong>
                        </div>
                        <div className={styles.statLine} />
                        <div className={styles.statItem}>
                            <span>FEEDBACK</span>
                            <strong>4.95</strong>
                        </div>
                    </div>

                    <div className={styles.cardFooter}>
                        <div className={styles.qrSection}>
                            <div className={styles.qrMock} />
                            <span>Scan for Full Asset Report</span>
                        </div>
                        <CheckCircle2 color="#00f2ff" size={16} />
                    </div>
                </div>
            </header>

            {/* Target Countries Selection */}
            <section className={styles.countrySection}>
                <div className={styles.sectionHeader}>
                    <h3>TARGET DESTINATIONS</h3>
                    <Settings size={16} color="#666" />
                </div>
                <div className={styles.countryGrid}>
                    {COUNTRIES.map(country => (
                        <div 
                            key={country.id} 
                            className={`${styles.countryCard} ${selectedCountry.id === country.id ? styles.activeCountry : ''}`}
                            onClick={() => setSelectedCountry(country)}
                            style={{ '--color': country.color } as any}
                        >
                            <span className={styles.flag}>{country.flag}</span>
                            <div className={styles.countryInfo}>
                                <h4>{country.name}</h4>
                                <span className={styles.visaType}>{country.visa}</span>
                            </div>
                            <div className={styles.statusIndicator}>
                                <div className={styles.statusDot} />
                                <span>{country.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Passport Tiles - Asset Management */}
            <section className={styles.assetsSection}>
                <div className={styles.sectionHeader}>
                    <h3>CURATED ASSETS</h3>
                    <Lock size={14} color="#666" />
                </div>
                <div className={styles.assetGrid}>
                    {PASSPORT_TILES.map(tile => (
                        <div key={tile.id} className={styles.assetTile}>
                            <div className={styles.tileIcon}>
                                {tile.icon}
                            </div>
                            <div className={styles.tileBody}>
                                <h4>{tile.title}</h4>
                                <p>{tile.desc}</p>
                            </div>
                            <button className={styles.tileAction}>
                                {tile.action === 'Download' ? <Download size={16} /> : <ArrowUpRight size={16} />}
                                <span>{tile.action}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action - Departure Pipeline */}
            <section className={styles.pipelineSection}>
                <div className={styles.pipelineCard}>
                    <div className={styles.pipelineContent}>
                        <PlaneLanding size={28} className={styles.neonIcon} />
                        <div>
                            <h4>호주 타일 마스터 파이프라인</h4>
                            <p>비자 인터뷰 및 고용 계약 검토 중 (D-14)</p>
                        </div>
                    </div>
                    <button className={styles.mainActionBtn}>진행 상황 확인</button>
                </div>
            </section>
        </div>
    );
}
