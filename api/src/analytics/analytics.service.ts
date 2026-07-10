import { Injectable } from '@nestjs/common';
import { IndustryType, FieldOpsFeature } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DAY = 24 * 60 * 60 * 1000;

// 마케팅 분석 웹(/analys)용 집계 — AnalyticsEvent + 도메인 테이블에서 산출.
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    // 이벤트 이름별 카운트
    const grouped = await this.prisma.analyticsEvent.groupBy({
      by: ['name'],
      _count: { _all: true },
    });
    const ec: Record<string, number> = {};
    for (const g of grouped) ec[g.name] = g._count._all;
    const cnt = (n: string) => ec[n] ?? 0;

    const [companies, jobPosts, workersSaved, interestsTotal] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.jobPost.count(),
      this.prisma.savedWorker.count(),
      this.prisma.interestRegistration.count(),
    ]);

    // 사용자 + 이벤트(Retention/Aha 계산용) — MVP 규모 가정, 단순 JS 집계
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        role: true,
        industries: true,
        createdAt: true,
        events: { select: { name: true, createdAt: true } },
      },
    });
    const now = Date.now();

    // Retention: 가입 후 window일 경과 코호트 중, 가입 window일 이후 return_visit 있는 비율.
    // 전체·유형별(§7.6) 공용 — 부분집합을 받아 윈도우별 코호트/재방문율 산출.
    const windows = [1, 7, 14, 30];
    const cohortRate = (subset: typeof users) =>
      windows.map((w) => {
        const cohort = subset.filter((u) => now - u.createdAt.getTime() >= w * DAY);
        const returned = cohort.filter((u) =>
          u.events.some(
            (e) =>
              e.name === 'return_visit' &&
              e.createdAt.getTime() - u.createdAt.getTime() >= w * DAY,
          ),
        ).length;
        return {
          window: `${w}일`,
          cohort: cohort.length,
          returned,
          rate: cohort.length ? Math.round((returned / cohort.length) * 100) : 0,
        };
      });
    const retention = cohortRate(users);

    // Aha 후보(§8-3): 행동을 한 유저 수 + 그들의 재방문율
    const ahaDefs = [
      { key: 'profile_completed', label: '프로필 완성' },
      { key: 'career_three_added', label: '경력 3건 등록' },
      { key: 'certificate_added', label: '자격증 등록' },
      { key: 'profile_shared', label: '프로필 공유' },
    ];
    const aha = ahaDefs.map((a) => {
      const did = users.filter((u) => u.events.some((e) => e.name === a.key));
      const returned = did.filter((u) =>
        u.events.some((e) => e.name === 'return_visit'),
      ).length;
      return {
        behavior: a.label,
        users: did.length,
        returnRate: did.length ? Math.round((returned / did.length) * 100) : 0,
      };
    });

    const interestGrouped = await this.prisma.interestRegistration.groupBy({
      by: ['feature'],
      _count: { _all: true },
    });
    const interest = interestGrouped
      .map((g) => ({ feature: g.feature, count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    // ── §7.6 유형별 retention 코호트 ──
    const ROLES = [
      'WORKER',
      'FIELD_LEADER',
      'CUSTOMER',
      'PROJECT_OPERATOR',
      'PERFORMER_COMPANY',
    ] as const;
    const retentionByRole = ROLES.map((role) => {
      const ru = users.filter((u) => u.role === role);
      return { role, total: ru.length, windows: cohortRate(ru) };
    });

    // ── §7.3 산업별 분해 (가입·작업요청·팀) ──
    const inds = Object.values(IndustryType);
    const [wrGrouped, teams] = await Promise.all([
      this.prisma.workRequest.groupBy({ by: ['industry'], _count: { _all: true } }),
      this.prisma.team.findMany({ select: { industries: true } }),
    ]);
    const wrByInd: Record<string, number> = {};
    for (const g of wrGrouped) if (g.industry) wrByInd[g.industry] = g._count._all;
    const byIndustry = inds
      .map((ind) => ({
        industry: ind,
        signups: users.filter((u) => u.industries.includes(ind)).length,
        workRequests: wrByInd[ind] ?? 0,
        teams: teams.filter((t) => t.industries.includes(ind)).length,
      }))
      .filter((r) => r.signups || r.workRequests || r.teams)
      .sort((a, b) => b.signups + b.workRequests - (a.signups + a.workRequests));

    // ── §7.4 FieldOps 7종 수요 + 진입 대비 클릭 ──
    const foGrouped = await this.prisma.fieldOpsInterest.groupBy({
      by: ['feature'],
      _count: { _all: true },
    });
    const foMap: Record<string, number> = {};
    for (const g of foGrouped) foMap[g.feature] = g._count._all;
    const fieldOps = {
      viewed: cnt('field_operations_viewed'),
      byFeature: Object.values(FieldOpsFeature).map((f) => ({
        feature: f,
        interests: foMap[f] ?? 0,
        clicks: cnt(`${f.toLowerCase()}_interest_clicked`),
      })),
    };

    // ── §7.5 AI현장리더 관심 ──
    const [aiTotal, aiByInd] = await Promise.all([
      this.prisma.aiLeaderInterest.count(),
      this.prisma.aiLeaderInterest.groupBy({ by: ['industry'], _count: { _all: true } }),
    ]);
    const aiInterest = {
      total: aiTotal,
      clicks: cnt('ai_field_leader_interest_clicked'),
      byIndustry: aiByInd
        .filter((g) => g.industry)
        .map((g) => ({ industry: g.industry, count: g._count._all })),
    };

    // ── §7.7 BM 검증(P0) — 급구 공고 검증 + 후보 열람 퍼널 + 유료 기능 관심 ──
    // 급구 공고 검증(P0-1): JobPost.isUrgent 실필드 기준 등록 수 + 등록의향/노출관심 이벤트
    const urgentJobPostCount = await this.prisma.jobPost.count({ where: { isUrgent: true } });
    const urgentJobFunnel = [
      { label: '급구 등록 관심', count: cnt('urgent_job_post_clicked') },
      { label: '급구 공고 등록', count: urgentJobPostCount },
      { label: '상단 노출 관심', count: cnt('job_boost_interest_submitted') },
    ];
    // 후보 열람 검증: 프로필 조회 → 관심 저장 → 상담 요청(파트너 포털 /partner 기준)
    const candidateFunnel = [
      { label: '프로필 조회', count: cnt('worker_profile_viewed_by_company') },
      { label: '관심 저장', count: cnt('candidate_saved') },
      { label: '상담 요청', count: cnt('candidate_consult_requested') },
    ];
    // 팀 매칭 검증(P0-3): 현장리더 등록 → 팀 생성(실 카운트) → 팀 매칭 상담 요청
    const teamCount = await this.prisma.team.count();
    const teamMatchingFunnel = [
      { label: '현장리더 등록', count: cnt('field_leader_registered') },
      { label: '팀 생성', count: teamCount },
      { label: '팀 매칭 상담 요청', count: cnt('team_matching_consult_requested') },
    ];
    // 유료 기능 관심: paid_feature_interest_submitted를 props.feature 기준으로 집계(단순 JS 집계).
    const paidFeatureEvents = await this.prisma.analyticsEvent.findMany({
      where: { name: 'paid_feature_interest_submitted' },
      select: { props: true },
    });
    const paidFeatureCounts: Record<string, number> = {};
    for (const e of paidFeatureEvents) {
      const feature = (e.props as { feature?: string } | null)?.feature ?? '기타';
      paidFeatureCounts[feature] = (paidFeatureCounts[feature] ?? 0) + 1;
    }
    const PAID_FEATURE_LABEL: Record<string, string> = {
      JOB_POSTING_FEE: '공고 등록비 관심',
      CANDIDATE_VIEW_FEE: '후보 열람비 관심',
      TEAM_MATCHING: '팀 매칭 수수료 관심',
    };
    const paidFeatureInterest = Object.entries(paidFeatureCounts).map(([feature, count]) => ({
      label: PAID_FEATURE_LABEL[feature] ?? feature,
      count,
    }));

    // ── §7.2 공통 온보딩 퍼널(정본) + 유형별 퍼널 ──
    const commonFunnel = [
      { label: '방문', count: cnt('page_view') },
      { label: '유형 선택', count: cnt('user_type_selected') },
      { label: '산업 선택', count: cnt('industry_selected') },
      { label: '가입 시작', count: cnt('signup_started') },
      { label: '가입 완료', count: cnt('signup_completed') },
      { label: '재방문', count: cnt('return_visit') },
    ];
    const funnelsByRole = {
      worker: [
        { label: '가입 완료', count: cnt('signup_completed') },
        { label: '기본 프로필', count: cnt('profile_basic_completed') },
        { label: '경력 등록', count: cnt('career_added') },
        { label: '프로필 완성', count: cnt('profile_completed') },
      ],
      fieldLeader: [
        { label: '리더 신청', count: cnt('field_leader_requested') },
        { label: '리더 프로필 시작', count: cnt('field_leader_profile_started') },
        { label: '리더 프로필 완료', count: cnt('field_leader_profile_completed') },
        { label: '반장 승인 완료', count: cnt('field_leader_registered') },
        { label: '팀 등록', count: cnt('team_created') },
      ],
      customer: [
        { label: '요청 시작', count: cnt('work_request_started') },
        { label: '요청 제출', count: cnt('work_request_submitted') },
        { label: '후보 지정', count: cnt('candidate_shortlisted') },
        { label: '완료 평가', count: cnt('project_review_submitted') },
      ],
    };

    return {
      totalUsers: users.length,
      overview: {
        visitors: cnt('page_view'),
        signups: cnt('signup_completed'),
        profilesCompleted: cnt('profile_completed'),
        interests: interestsTotal,
        companies,
        jobPosts,
        workersSaved,
        pocInterest: cnt('poc_interest_submitted'),
      },
      // BM 검증(P0) 지표 — 급구 공고 + 후보 열람 퍼널 + 유료 기능 관심
      urgentJobFunnel,
      candidateFunnel,
      teamMatchingFunnel,
      paidFeatureInterest,
      funnels: {
        signup: [
          { label: '방문', count: cnt('page_view') },
          { label: '가입 시작', count: cnt('signup_started') },
          { label: '가입 완료', count: cnt('signup_completed') },
        ],
        profile: [
          { label: '가입 완료', count: cnt('signup_completed') },
          { label: '기본 프로필', count: cnt('profile_basic_completed') },
          { label: '경력 등록', count: cnt('career_added') },
          { label: '자격/교육', count: cnt('certificate_added') + cnt('education_added') },
          { label: '프로필 완성', count: cnt('profile_completed') },
        ],
        company: [
          { label: '기업 가입', count: cnt('company_signup_completed') },
          { label: '공고 등록', count: cnt('job_post_submitted') },
          { label: '기술자 검색', count: cnt('worker_search') },
          { label: '관심 저장', count: cnt('candidate_saved') },
          { label: 'PoC 신청', count: cnt('poc_interest_submitted') },
        ],
      },
      retention,
      retentionByRole,
      aha,
      interest,
      // ── §7.2~7.5 심화 ──
      commonFunnel,
      funnelsByRole,
      byIndustry,
      fieldOps,
      aiInterest,
    };
  }
}
