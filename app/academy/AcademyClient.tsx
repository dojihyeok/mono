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
    Target,
    ShieldCheck,
    Cpu,
    Database,
    Scan,
    TrendingUp,
    Volume2,
    ArrowRight
} from 'lucide-react';

const COURSES = [
    {
        id: 'c1',
        title: '반도체 P5 특수 배관 공법 실무',
        category: '심화 직무 기술',
        level: '체계화',
        progress: 65,
        instructor: '김 소장 (AI Analysis)',
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?w=500&q=80',
        points: 450,
        badge: '하이테크'
    },
    {
        id: 'c2',
        title: '해외 현장 실무 영어 (상황별)',
        category: '글로벌 역량',
        level: '중급',
        progress: 30,
        instructor: '엠마 선생님 (원어민)',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        points: 300,
        badge: '글로벌'
    },
    {
        id: 'c3',
        title: '프리미엄 타일 레이아웃 및 설계',
        category: '직무 기술',
        level: '전문가',
        progress: 0,
        instructor: '이 소장 (Architect)',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
        points: 500,
        badge: '디자인'
    }
];

const SKILL_RADAR = [
    { name: '공법 숙련도', value: 85, icon: <Cpu size={14} /> },
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
                    <h1>모노 아카데미</h1>
                    <div className={styles.points}>
                        <Zap size={16} color="#D4AF37" fill="#D4AF37" />
                        <span>성장 포인트 2,450 SP</span>
                    </div>
                </div>
                <p className={styles.subtitle}>검증된 기술력으로 전문가님의 가치를 증명하세요.</p>
            </header>

            {/* Roadmap */}
            <section className={styles.roadmapSection}>
                <div className={styles.roadmapHeader}>
                    <h2><TrendingUp size={20} color="#D4AF37" /> 나의 성장 로드맵</h2>
                    <span className={styles.grade}>목표: 글로벌 팀 리더</span>
                </div>
                <div className={styles.roadmapCard}>
                    <div className={styles.roadmapPath}>
                        <div className={styles.roadmapStep}>
                            <div className={`${styles.stepDot} ${styles.stepDone}`}>
                                <ShieldCheck size={20} />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>기초 배관 이론</h4>
                                <p>수료 완료</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot} style={{borderColor: '#D4AF37', borderStyle: 'dashed'}}>
                                <Cpu size={20} color="#D4AF37" />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>특수 배관 실습</h4>
                                <p style={{color: '#D4AF37'}}>65% 진행 중</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot}>
                                <Globe size={20} />
                            </div>
                            <div className={styles.stepInfo}>
                                <h4>해외 현장 영어</h4>
                                <p>다음 목표</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Analysis */}
            <section className={styles.radarSection}>
                <div className={styles.radarCard}>
                    <div className={styles.radarHeader}>
                        <Target size={24} color="#D4AF37" />
                        <h3>AI 역량 분석 리포트</h3>
                    </div>
                    <div className={styles.radarContent}>
                        <div className={styles.radarChartMock}>
                            {SKILL_RADAR.map((skill, idx) => (
                                <div key={idx} className={styles.radarBarWrapper}>
                                    <div className={styles.radarLabel}>
                                        {skill.name}
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
                            <Zap size={28} color="#D4AF37" />
                            <p><strong>AI 반장님의 추천:</strong><br/> 현재 '현장 영어' 역량을 조금 더 보완하시면, <strong>호주 브리즈번 High-Tech 공정</strong>의 전문가 추천 확률이 <strong>92%</strong>로 비약적으로 상승합니다.</p>
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
                    추천 교육 과정
                </button>
                <button 
                    className={selectedTab === 'global' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('global')}
                >
                    글로벌 어학 지원
                </button>
                <button 
                    className={selectedTab === 'cert' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('cert')}
                >
                    보유 자격 및 수료증
                </button>
            </div>

            {/* Course Content */}
            {selectedTab === 'courses' && (
                <section className={styles.courseSection}>
                    <div className={styles.courseGrid}>
                        {COURSES.map(course => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseThumb} style={{ backgroundImage: `url(${course.image})` }}>
                                    <div className={styles.courseLevel}>{course.level}</div>
                                    {course.progress > 0 && (
                                        <div className={styles.playButton}>
                                            <Play size={24} fill="#D4AF37" color="#D4AF37" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.courseBody}>
                                    <div className={styles.courseMeta}>
                                        <span className={styles.category}>{course.category}</span>
                                        <span className={styles.sp}>+{course.points} SP</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <div className={styles.instructor}>담당 전문가: {course.instructor}</div>
                                    
                                    <div className={styles.progressSection}>
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill} 
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <div className={styles.progressInfo}>
                                            <span>{course.progress}% 학습 완료</span>
                                            <Award size={14} color={course.progress === 100 ? '#D4AF37' : 'rgba(255,255,255,0.1)'} />
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
                            <Volume2 size={32} color="#D4AF37" />
                            <div>
                                <h4>[오늘의 문장] 현장 실무 영어 기초</h4>
                                <p>"The welding zone requires secondary gas verification."</p>
                            </div>
                        </div>
                        <button style={{background: '#D4AF37', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer'}}>발음 연습하기</button>
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
                                    <p style={{fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', lineHeight: '1.6'}}>네이티브 코치와 함께하는<br/>실전 현장 커뮤니케이션 트레이닝.</p>
                                    <button style={{width: '100%', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer'}}>트레이닝 시작</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'cert' && (
                <div className={styles.certGrid}>
                    {[
                        { name: '하이테크 플랜트 전문가', issuer: 'MONO ACADEMY', icon: <Cpu size={32} color="#D4AF37" /> },
                        { name: '산업 안전 전문 관리자', issuer: 'KOSHA / MONO', icon: <ShieldCheck size={32} color="#D4AF37" /> },
                        { name: '글로벌 테크니션 (Lv.2)', issuer: 'GLOBAL MONO', icon: <Globe size={32} color="#D4AF37" /> },
                        { name: '전문 배관 공정 수료', issuer: 'SAMSUNG EPC', icon: <Zap size={32} color="#D4AF37" fill="#D4AF37" /> }
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
        </div>
    );
}
