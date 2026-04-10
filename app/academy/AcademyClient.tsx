'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    BookOpen, 
    Zap, 
    Globe, 
    Award, 
    ChevronRight, 
    Play, 
    MessageCircle,
    Target,
    BarChart2,
    ShieldCheck,
    Cpu,
    Database,
    Scan,
    TrendingUp,
    Volume2
} from 'lucide-react';

const COURSES = [
    {
        id: 'c1',
        title: '반도체 P5 특수 배관 공법',
        category: '심화 기술',
        level: 'MASTER',
        progress: 65,
        instructor: '김 소장 (AI Analysis)',
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?w=500&q=80',
        points: 450,
        badge: '하이테크'
    },
    {
        id: 'c2',
        title: '호주 현장 실무 영어 (상황별)',
        category: '글로벌 생존 영어',
        level: 'INTERMEDIATE',
        progress: 30,
        instructor: '엠마 쌤 (Native)',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        points: 300,
        badge: '글로벌'
    },
    {
        id: 'c3',
        title: '프리미엄 타일 레이아웃 설계',
        category: '전술 인테리어',
        level: 'EXPERT',
        progress: 0,
        instructor: '이 소장 (Architect)',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
        points: 500,
        badge: '디자인'
    }
];

const SKILL_RADAR = [
    { name: '공법 숙력도', value: 85, icon: <Cpu size={14} /> },
    { name: '현장 영어', value: 42, icon: <Globe size={14} /> },
    { name: '도면 분석', value: 90, icon: <Database size={14} /> },
    { name: '안전 관리', value: 95, icon: <ShieldCheck size={14} /> },
    { name: '팀 리딩', value: 70, icon: <TrendingUp size={14} /> },
];

export default function AcademyClient() {
    const [mounted, setMounted] = useState(false);
    const [selectedTab, setSelectedTab] = useState('courses');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>마스터 아카데미</h1>
                    <div className={styles.points}>
                        <Zap size={16} color="#B48A09" fill="#B48A09" />
                        <span>2,450 SP</span>
                    </div>
                </div>
                <p className={styles.subtitle}>데이터로 입증하는 마스터의 기술적 자산화.</p>
            </header>

            {/* Tactical Skill Tree Roadmap */}
            <section className={styles.roadmapSection}>
                <div className={styles.roadmapHeader}>
                    <h2><Scan size={18} color="#B48A09" /> 퍼스널 스킬 트리</h2>
                    <span className={styles.grade}>TARGET: GLOBAL TEAM LEADER</span>
                </div>
                <div className={styles.roadmapCard}>
                    <div className={styles.roadmapPath}>
                        <div className={styles.roadmapStep}>
                            <div className={`${styles.stepDot} ${styles.stepDone}`}>
                                <ShieldCheck size={18} />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>기초 배관 이론</h4>
                                <p>DATA VERIFIED</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot} style={{borderColor: '#B48A09', borderStyle: 'dashed'}}>
                                <Cpu size={18} color="#B48A09" />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>특수 배관 실습</h4>
                                <p style={{color: '#B48A09'}}>65% PROCESSING</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot}>
                                <Globe size={18} />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>글로벌 영어</h4>
                                <p>NEXT MISSION</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Skill Analysis */}
            <section className={styles.radarSection}>
                <div className={styles.radarCard}>
                    <div className={styles.radarHeader}>
                        <Target size={20} color="#B48A09" />
                        <h3>AI 역량 진단 포트폴리오</h3>
                        <span className={styles.grade}>MASTER STATUS</span>
                    </div>
                    <div className={styles.radarContent}>
                        <div className={styles.radarChartMock}>
                            {SKILL_RADAR.map((skill, idx) => (
                                <div key={idx} className={styles.radarBarWrapper}>
                                    <div className={styles.radarLabel}>
                                        {skill.icon} {skill.name}
                                    </div>
                                    <div className={styles.radarBarBase}>
                                        <div 
                                            className={styles.radarBarFill} 
                                            style={{ width: `${skill.value}%` }}
                                        />
                                    </div>
                                    <div className={styles.radarValue}>{skill.value}%</div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.aiSuggestion}>
                            <Zap size={24} color="#B48A09" />
                            <p><strong>AI INSIGHT:</strong> 현재 '현장 영어' 역량이 보완되면 <strong>호주 브리즈번 EPC 현장</strong> 마스터 추천 확률이 <strong>92%</strong>까지 도달합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button 
                    className={selectedTab === 'courses' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('courses')}
                >
                    미션 코스
                </button>
                <button 
                    className={selectedTab === 'global' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('global')}
                >
                    글로벌 마스터링
                </button>
                <button 
                    className={selectedTab === 'cert' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('cert')}
                >
                    디지털 배지
                </button>
            </div>

            {/* Tab Content Rendering */}
            {selectedTab === 'courses' && (
                <section className={styles.courseSection}>
                    <div className={styles.courseGrid}>
                        {COURSES.map(course => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseThumb} style={{ backgroundImage: `url(${course.image})` }}>
                                    <div className={styles.courseLevel}>{course.level}</div>
                                    {course.progress > 0 && (
                                        <div className={styles.playButton}>
                                            <Play size={20} fill="#B48A09" color="#B48A09" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.courseBody}>
                                    <div className={styles.courseMeta}>
                                        <span className={styles.category}>{course.category}</span>
                                        <span className={styles.sp}>+{course.points} SP</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <div className={styles.instructor}>INS: {course.instructor}</div>
                                    
                                    <div className={styles.progressSection}>
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill} 
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <div className={styles.progressInfo}>
                                            <span>{course.progress}% ANALYSIS DONE</span>
                                            <Award size={14} color={course.progress === 100 ? '#B48A09' : '#333'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {selectedTab === 'global' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                    <div className={styles.globalBanner}>
                        <div className={styles.bannerContent}>
                            <Volume2 size={32} className={styles.pulseIcon} />
                            <div>
                                <h4>[LIVE] 오늘의 현장 서바이벌 영어</h4>
                                <p>"The welding zone requires secondary gas verification."</p>
                            </div>
                        </div>
                        <button style={{background: '#B48A09', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800}}>발음 교정하기</button>
                    </div>

                    <div className={styles.courseGrid}>
                        {COURSES.filter(c => c.badge === '글로벌').map(course => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseThumb} style={{ backgroundImage: `url(${course.image})` }}>
                                    <div className={styles.courseLevel}>{course.level}</div>
                                </div>
                                <div className={styles.courseBody}>
                                    <div className={styles.courseMeta}>
                                        <span className={styles.category}>{course.category}</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <p style={{fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem'}}>네이티브 마스터와 함께하는 실전 커뮤니케이션.</p>
                                    <button style={{width: '100%', background: 'rgba(180, 138, 9, 0.1)', border: '1px solid #B48A09', color: '#B48A09', padding: '12px', borderRadius: '10px', fontWeight: 800}}>트레이닝 시작</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'cert' && (
                <div className={styles.certGrid}>
                    {[
                        { name: '하이테크 플랜트 마스터', issuer: 'MONO PROTOCOL', icon: <Cpu size={32} color="#B48A09" /> },
                        { name: '산업 안전 골드 관제자', issuer: 'KOSHA / MONO', icon: <ShieldCheck size={32} color="#B48A09" /> },
                        { name: '글로벌 테크니션 (L2)', issuer: 'GLOBAL MONO', icon: <Globe size={32} color="#B48A09" /> },
                        { name: '전략적 배관 숙련공', issuer: 'SAMSUNG EPC', icon: <Zap size={32} color="#B48A09" fill="#B48A09" /> }
                    ].map((cert, i) => (
                        <div key={i} className={styles.certCard}>
                            <div className={styles.badgeGlow}>
                                {cert.icon}
                            </div>
                            <div className={styles.certName}>{cert.name}</div>
                            <div className={styles.certIssuer}>{cert.issuer}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Recommendation Banner */}
            <div className={styles.globalBanner}>
                <div className={styles.bannerContent}>
                    <Globe size={28} className={styles.pulseIcon} />
                    <div>
                        <h4>호주 멜버른 퀸즐랜드 현장 파견 미션</h4>
                        <p>특수 금속 배관 마스터 급구 (Daily Rate $700+ AUD)</p>
                    </div>
                </div>
                <ChevronRight size={24} color="#B48A09" />
            </div>
        </div>
    );
}
