'use client';

import React, { useState } from 'react';
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
    ShieldCheck
} from 'lucide-react';

const COURSES = [
    {
        id: 'c1',
        title: '반도체 P5 특수 배관 공법',
        category: '심화 기술',
        level: '마스터 등급',
        progress: 65,
        instructor: '김 소장',
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?w=500&q=80',
        points: 450,
        badge: '하이테크'
    },
    {
        id: 'c2',
        title: '호주 현장 실무 영어 (상황별)',
        category: '글로벌 생존 영어',
        level: '중급',
        progress: 30,
        instructor: '엠마 쌤',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
        points: 300,
        badge: '글로벌'
    },
    {
        id: 'c3',
        title: '프리미엄 타일 레이아웃 설계',
        category: '인테리어',
        level: '전문가',
        progress: 0,
        instructor: '이 소장',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80',
        points: 500,
        badge: '디자인'
    }
];

const SKILL_RADAR = [
    { name: '공법 숙련도', value: 85 },
    { name: '현장 영어', value: 42 },
    { name: '도면 분석', value: 90 },
    { name: '안전 관리', value: 95 },
    { name: '팀 리딩', value: 70 },
];

export default function AcademyClient() {
    const [selectedTab, setSelectedTab] = useState('courses');

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>마스터 아카데미</h1>
                    <div className={styles.points}>
                        <Zap size={14} fill="currentColor" />
                        <span>2,450 점</span>
                    </div>
                </div>
                <p className={styles.subtitle}>기술의 정점에서 글로벌 마스터로 도약하세요.</p>
            </header>

            {/* AI Personal Roadmap - New */}
            <section className={styles.roadmapSection}>
                <div className={styles.roadmapHeader}>
                    <h2>AI 퍼스널 로드맵</h2>
                    <span className={styles.grade}>TARGET: 글로벌 배관 팀장</span>
                </div>
                <div className={styles.roadmapCard}>
                    <div className={styles.roadmapPath}>
                        <div className={styles.roadmapStep}>
                            <div className={`${styles.stepDot} ${styles.stepDone}`}>✓</div>
                            <div className={styles.stepInfo}>
                                <h4>기초 배관 이론</h4>
                                <p>수료 완료</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot}>2</div>
                            <div className={styles.stepInfo}>
                                <h4>하이테크 특수 배관 실습</h4>
                                <p>추천 코스 (65% 진행 중)</p>
                            </div>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepDot}>3</div>
                            <div className={styles.stepInfo}>
                                <h4>글로벌 마스터 서바이벌 영어</h4>
                                <p>다음 단계 (해외 진출 필수)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Skill Analysis Radar */}
            <section className={styles.radarSection}>
                <div className={styles.radarCard}>
                    <div className={styles.radarHeader}>
                        <Target size={18} className={styles.neonIcon} />
                        <h3>AI 역량 진단 데이터</h3>
                        <span className={styles.grade}>마스터 등급</span>
                    </div>
                    <div className={styles.radarContent}>
                        <div className={styles.radarChartMock}>
                            {SKILL_RADAR.map((skill, idx) => (
                                <div key={idx} className={styles.radarBarWrapper}>
                                    <div className={styles.radarLabel}>{skill.name}</div>
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
                            <Zap size={16} color="#00f2ff" />
                            <p><strong>글로벌 진출 제안:</strong> 현재 '현장 영어' 역량이 보완되면 <strong>호주 타일 마스터 비자</strong> 승인 확률이 85%까지 상승합니다.</p>
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
                    코스
                </button>
                <button 
                    className={selectedTab === 'global' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('global')}
                >
                    글로벌 준비
                </button>
                <button 
                    className={selectedTab === 'cert' ? styles.activeTab : ''}
                    onClick={() => setSelectedTab('cert')}
                >
                    자격인증
                </button>
            </div>

            {/* Tab Content Rendering */}
            {selectedTab === 'courses' && (
                <section className={styles.courseSection}>
                    <div className={styles.sectionTitle}>
                        <h2>내 학습 현황</h2>
                        <span>전체보기</span>
                    </div>
                    
                    <div className={styles.courseGrid}>
                        {COURSES.map(course => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseThumb} style={{ backgroundImage: `url(${course.image})` }}>
                                    <div className={styles.courseLevel}>{course.level}</div>
                                    {course.progress > 0 && (
                                        <div className={styles.playButton}>
                                            <Play size={20} fill="white" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.courseBody}>
                                    <div className={styles.courseMeta}>
                                        <span className={styles.category}>{course.category}</span>
                                        <span className={styles.sp}>+{course.points} SP</span>
                                    </div>
                                    <h3>{course.title}</h3>
                                    <div className={styles.instructor}>by {course.instructor}</div>
                                    
                                    <div className={styles.progressSection}>
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill} 
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <div className={styles.progressInfo}>
                                            <span>{course.progress}% 완료</span>
                                            <Award size={14} color={course.progress === 100 ? '#00f2ff' : '#666'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {selectedTab === 'global' && (
                <div className={styles.globalContent}>
                    <div className={styles.langCard}>
                        <div className={styles.survivalInfo}>
                            <div className={styles.iconCircle}>
                                <MessageCircle color="#00f2ff" />
                            </div>
                            <div>
                                <h4 style={{color: '#fff'}}>오늘의 현장 서바이벌 영어</h4>
                                <p style={{color: '#00f2ff'}}>"Can we verify the tile alignment before setting?"</p>
                            </div>
                        </div>
                        <button className={styles.listenBtn} style={{marginTop: '1rem', width: '100%'}}>AI 원어민 발음 듣기</button>
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
                                    <button className={styles.listenBtn} style={{width: '100%', marginTop: '1rem'}}>학습 시작</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTab === 'cert' && (
                <div className={styles.certGrid}>
                    {[
                        { name: '하이테크 플랜트 마스터', issuer: 'MONO ACADEMY', icon: <Award size={32} color="#ffd700" /> },
                        { name: '산업 안전 골드 관리자', issuer: 'KOSHA / MONO', icon: <ShieldCheck size={32} color="#00f2ff" /> },
                        { name: '글로벌 테크니션 (L2)', issuer: 'GLOBAL MONO', icon: <Globe size={32} color="#a855f7" /> },
                        { name: '자동화 배관 숙련공', issuer: 'SAMSUNG EPC', icon: <Zap size={32} color="#ff6b00" /> }
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
            <div className={styles.globalBanner} style={{marginTop: '40px'}}>
                <div className={styles.bannerContent}>
                    <Globe size={24} className={styles.pulseIcon} />
                    <div>
                        <h4>호주 시드니 현장 마스터 파견</h4>
                        <p>특수 타공 기술자 급구 (일당 $650+)</p>
                    </div>
                </div>
                <ChevronRight size={20} />
            </div>
        </div>
    );
}
