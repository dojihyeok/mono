import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  JobPostStatus,
  UserRole,
  WorkRequestStatus,
  IndustryType,
  VisaDocStatus,
  FieldOpsFeature,
  Residency,
  PartnerReferralStatus,
  LeadStage,
  SitePrepStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { ReviewSitePrepDto } from './dto/review-site-prep.dto';

// 운영 콘솔(/amono)용 집계·조회. 현재는 기술자(User) 도메인 기준.
// 기업·공고 카운트는 /partner 도메인 구현 후 채워진다(지금은 0).
@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // Overview: 핵심 카운트 + North Star(검증 프로필) + 가입 퍼널 + 관심 기능 분포
  async overview() {
    const [
      users,
      careerCards,
      certificates,
      educations,
      interests,
      events,
      companies,
      jobPosts,
      foremanRequests,
      workRequests,
      reviews,
      teams,
      fieldOpsInterests,
      performerCompanies,
      operators,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.careerCard.count(),
      this.prisma.certificate.count(),
      this.prisma.education.count(),
      this.prisma.interestRegistration.count(),
      this.prisma.analyticsEvent.count(),
      this.prisma.company.count(),
      this.prisma.jobPost.count(),
      this.prisma.user.count({ where: { foremanRequested: true, role: 'WORKER' } }),
      this.prisma.workRequest.count(),
      this.prisma.review.count(),
      this.prisma.team.count(),
      this.prisma.fieldOpsInterest.count(),
      this.prisma.company.count({ where: { companyKind: 'PERFORMER' } }),
      this.prisma.user.count({ where: { role: 'PROJECT_OPERATOR' } }),
    ]);

    const verifiedProfiles = await this.countVerifiedProfiles();

    // 유형(5종) 분포 + 작업요청 산업(11종) 분포 — 캐노니컬 운영 대시보드(§6.2·6.3)
    const [roleGrouped, wrIndustryGrouped] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.workRequest.groupBy({ by: ['industry'], _count: { _all: true } }),
    ]);
    const roleDistribution = roleGrouped
      .map((g) => ({ role: g.role, count: g._count._all }))
      .sort((a, b) => b.count - a.count);
    const workRequestsByIndustry = wrIndustryGrouped
      .map((g) => ({ industry: g.industry, count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    // 가입 퍼널(이벤트 기반): 방문 → 가입 시작 → 가입 완료 → 프로필 완성
    const funnelSteps = [
      { key: 'page_view', label: '방문' },
      { key: 'signup_started', label: '가입 시작' },
      { key: 'signup_completed', label: '가입 완료' },
      { key: 'profile_completed', label: '프로필 완성' },
    ];
    const funnelCounts = await Promise.all(
      funnelSteps.map((s) =>
        this.prisma.analyticsEvent.count({ where: { name: s.key } }),
      ),
    );
    const funnel = funnelSteps.map((s, i) => ({ ...s, count: funnelCounts[i] }));

    // 관심 기능 분포(많은 순)
    const grouped = await this.prisma.interestRegistration.groupBy({
      by: ['feature'],
      _count: { _all: true },
    });
    const interestByFeature = grouped
      .map((g) => ({ feature: g.feature, count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    return {
      counts: {
        users,
        verifiedProfiles,
        careerCards,
        certificates,
        educations,
        interests,
        events,
        companies,
        jobPosts,
        foremanRequests,
        workRequests,
        reviews,
        teams,
        fieldOpsInterests,
        performerCompanies,
        operators,
      },
      funnel,
      interestByFeature,
      roleDistribution,
      workRequestsByIndustry,
    };
  }

  // North Star(§8-1): 기본정보(이름·직군·연차·희망지역) + 경력 1건 + 자격/교육 1건.
  private async countVerifiedProfiles(): Promise<number> {
    const users = await this.prisma.user.findMany({
      where: { name: { not: null }, careerYears: { not: null } },
      select: {
        id: true,
        jobType: true,
        region: true,
        _count: {
          select: { careerCards: true, certificates: true, educations: true },
        },
      },
    });
    return users.filter(
      (u) =>
        u.jobType.length > 0 &&
        u.region.length > 0 &&
        u._count.careerCards >= 1 &&
        (u._count.certificates >= 1 || u._count.educations >= 1),
    ).length;
  }

  // 기술자 목록(최신 가입순). 운영자 화면이라 연락처 포함(개인정보 분리·접근로그는 §10 후속).
  async listUsers(limit = 100) {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500),
      select: {
        id: true,
        name: true,
        role: true,
        foremanRequested: true,
        phone: true,
        email: true,
        jobType: true,
        careerYears: true,
        region: true,
        createdAt: true,
        _count: {
          select: {
            careerCards: true,
            certificates: true,
            educations: true,
            interests: true,
          },
        },
      },
    });
  }

  // 반장 승인/해제 — User.role 설정(반장 권한 = 팀 생성 자격). 승인/해제 시 대기 플래그도 정리.
  async setUserRole(id: string, role: UserRole) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { role, foremanRequested: false },
      });
      // BM 검증 지표: 반장 승인 완료 시점(팀 매칭 BM 퍼널의 핵심 전환). best-effort — 실패해도 승인 자체는 막지 않음.
      if (role === 'FIELD_LEADER') {
        this.prisma.analyticsEvent
          .create({ data: { name: 'field_leader_registered', userId: id } })
          .catch(() => undefined);
      }
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`User ${id} not found`);
      }
      throw e;
    }
  }

  // 반장 신청 반려 — 승격 없이 대기 플래그만 해제.
  async rejectForeman(id: string) {
    try {
      await this.prisma.user.update({ where: { id }, data: { foremanRequested: false } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`User ${id} not found`);
      }
      throw e;
    }
  }

  // 반장 승인 대기 목록 — 신청(대기) 중인 기능공. 경력/자격 갯수로 판단 보조.
  listForemanRequests() {
    return this.prisma.user.findMany({
      where: { foremanRequested: true, role: 'WORKER' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        phone: true,
        jobType: true,
        careerYears: true,
        region: true,
        createdAt: true,
        _count: {
          select: { careerCards: true, certificates: true, educations: true },
        },
      },
    });
  }

  // 채용 공고 관리 — 전체 공고(회사명·상태) 최신순
  listJobPosts() {
    return this.prisma.jobPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { company: { select: { name: true } } },
    });
  }

  // 공고 상태 변경(승인=OPEN / 마감=CLOSED / 승인대기=PENDING)
  async setJobPostStatus(id: string, status: JobPostStatus) {
    try {
      const post = await this.prisma.jobPost.update({ where: { id }, data: { status } });
      // 승인(OPEN) 시 매칭 기술자에게 알림(best-effort, 실패해도 승인은 성공).
      if (status === 'OPEN') {
        await this.notifications.notifyMatchingUsers(id);
      }
      return post;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`JobPost ${id} not found`);
      }
      throw e;
    }
  }

  // 작업요청 관리 — 전체 요청(요청자명·산업·상태) 최신순 (§6.4)
  listWorkRequests(limit = 100) {
    return this.prisma.workRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500),
      include: {
        requester: { select: { name: true, role: true } },
        _count: { select: { candidates: true } },
      },
    });
  }

  // 작업요청 상태 변경(DRAFT→OPEN→MATCHING→ASSIGNED→COMPLETED→CLOSED/CANCELLED)
  async setWorkRequestStatus(id: string, status: WorkRequestStatus) {
    try {
      return await this.prisma.workRequest.update({ where: { id }, data: { status } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`WorkRequest ${id} not found`);
      }
      throw e;
    }
  }

  // PoC 리포트(§7.3 P2) — 산업별 수요·공급·검증 집계 + 총계. 투자/영업 증빙용.
  async pocReport() {
    const industries = Object.values(IndustryType);
    const rows = await Promise.all(
      industries.map(async (ind) => {
        const [workRequests, performers, teams, workRecords] = await Promise.all([
          this.prisma.workRequest.count({ where: { industry: ind } }),
          this.prisma.company.count({ where: { companyKind: 'PERFORMER', industries: { has: ind } } }),
          this.prisma.team.count({ where: { industries: { has: ind } } }),
          this.prisma.workRecord.count({ where: { industry: ind } }),
        ]);
        return { industry: ind, workRequests, performers, teams, workRecords };
      }),
    );
    // 수요(작업요청) 많은 산업 우선, 활동 없는 산업은 뒤로.
    rows.sort((a, b) => (b.workRequests + b.performers) - (a.workRequests + a.performers));

    const [reviews, fieldOpsInterests, candidates, trustAgg] = await Promise.all([
      this.prisma.review.count(),
      this.prisma.fieldOpsInterest.count(),
      this.prisma.workRequestCandidate.count(),
      this.prisma.trustScore.aggregate({ _avg: { score: true }, _count: { _all: true } }),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      industries: rows,
      totals: {
        reviews,
        fieldOpsInterests,
        candidates,
        trustScores: trustAgg._count._all,
        avgTrustScore: trustAgg._avg.score != null ? Math.round(trustAgg._avg.score * 10) / 10 : null,
      },
    };
  }

  // 평가 모니터링 — 최근 평가(평가자명 포함) 최신순 (§6.6)
  listReviews(limit = 100) {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500),
      include: { rater: { select: { name: true, role: true } } },
    });
  }

  // 후보 관리(BM 검증 P0-2) — 기업이 저장한 관심 기술자 + 상담 요청 현황(최신순)
  async listCandidates(limit = 100) {
    const take = Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500);
    const [saved, consults] = await Promise.all([
      this.prisma.savedWorker.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        include: {
          company: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, jobType: true, region: true, careerYears: true } },
        },
      }),
      this.prisma.consultRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        include: {
          company: { select: { id: true, name: true } },
          targetUser: { select: { id: true, name: true } },
        },
      }),
    ]);
    return { saved, consults };
  }

  // 팀 관리(BM 검증 P0-3) — 팀 + 팀원 + 반장 정보(최신순)
  async listTeams(limit = 100) {
    return this.prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500),
      include: {
        leader: { select: { id: true, name: true, phone: true } },
        members: { include: { user: { select: { id: true, name: true } } } },
      },
    });
  }

  // ── 현장 준비 서류 검토(Field Pass P0) — 자가신고 → 관리자 승인/반려 ──

  listSitePrepItems(status?: SitePrepStatus, limit = 200) {
    return this.prisma.sitePrepItem.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 200, 1), 500),
      include: { user: { select: { id: true, name: true, phone: true } } },
    });
  }

  async reviewSitePrepItem(id: string, dto: ReviewSitePrepDto) {
    try {
      return await this.prisma.sitePrepItem.update({
        where: { id },
        data: {
          status: dto.status,
          memo: dto.memo,
          reviewedBy: 'admin',
          reviewedAt: new Date(),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`SitePrepItem ${id} not found`);
      }
      throw e;
    }
  }

  // ── 리드 관리(BM 검증 CRM) — 콜드메일 리드 → 인터뷰 → 설문 → PoC 관심 ──

  listLeads(stage?: LeadStage, limit = 200) {
    return this.prisma.lead.findMany({
      where: stage ? { stage } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 200, 1), 500),
      include: {
        interviews: { orderBy: { createdAt: 'desc' } },
        surveyResponses: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  createLead(dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: dto });
  }

  async updateLead(id: string, dto: UpdateLeadDto) {
    try {
      return await this.prisma.lead.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Lead ${id} not found`);
      }
      throw e;
    }
  }

  createInterview(dto: CreateInterviewDto) {
    return this.prisma.interview.create({
      data: {
        leadId: dto.leadId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        notes: dto.notes,
      },
    });
  }

  async updateInterview(id: string, dto: UpdateInterviewDto) {
    try {
      return await this.prisma.interview.update({
        where: { id },
        data: {
          completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
          notes: dto.notes,
          followUpAction: dto.followUpAction,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Interview ${id} not found`);
      }
      throw e;
    }
  }

  listSurveyResponses(limit = 200) {
    return this.prisma.surveyResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 200, 1), 500),
      include: { lead: { select: { id: true, name: true, company: true } } },
    });
  }

  createSurveyResponse(dto: CreateSurveyResponseDto) {
    return this.prisma.surveyResponse.create({
      data: { leadId: dto.leadId, role: dto.role, answers: dto.answers },
    });
  }

  // 이벤트 로그(최신순, 이름 필터 옵션)
  async listEvents(params: { name?: string; limit?: number }) {
    const { name, limit = 100 } = params;
    return this.prisma.analyticsEvent.findMany({
      where: name ? { name } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 100, 1), 500),
      select: { id: true, name: true, userId: true, props: true, createdAt: true },
    });
  }

  // ── 외국인 인력 운영 큐·리포트 (dev-plan-foreign-workforce §6·§8) ──

  // 체류 만료 알림 큐 — days 일 이내 만료(또는 이미 만료) 비자. 만료일 빠른 순.
  listExpiringVisas(days = 30) {
    const horizon = new Date(Date.now() + days * 86400000);
    return this.prisma.visaStatus.findMany({
      where: { expiryDate: { not: null, lte: horizon } },
      orderBy: { expiryDate: 'asc' },
      take: 200,
      include: { user: { select: { id: true, name: true, phone: true } } },
    });
  }

  // 서류 검토 큐 — 미검토(SUBMITTED/PENDING) 서류 최신순.
  listPendingDocuments() {
    return this.prisma.documentRecord.findMany({
      where: { status: { in: [VisaDocStatus.SUBMITTED, VisaDocStatus.PENDING] } },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { id: true, name: true } } },
    });
  }

  // 외국인 인력 투입 리포트 (§8-3) — 산업·비자·한국어 분포 + 운영 총계.
  async foreignReport() {
    // 외국인 판정 = 거주구분 OVERSEAS 이거나 국적이 등록된 자.
    // (온보딩서 내국인=DOMESTIC 도 저장되므로 residency!=null 로는 내국인 오분류됨 → OVERSEAS 로 한정)
    const foreignWhere: Prisma.WorkerProfileWhereInput = {
      OR: [{ residency: Residency.OVERSEAS }, { nationality: { not: null } }],
    };
    const [
      foreignWorkers,
      byVisa,
      byKorean,
      byIndustry,
      settlements,
      referrals,
      riskReports,
      trainings,
    ] = await Promise.all([
      this.prisma.workerProfile.count({ where: foreignWhere }),
      this.prisma.visaStatus.groupBy({ by: ['visaType'], _count: { _all: true } }),
      this.prisma.workerProfile.groupBy({
        by: ['koreanLevel'],
        where: foreignWhere,
        _count: { _all: true },
      }),
      // 산업별 외국인 워커 수
      Promise.all(
        Object.values(IndustryType).map(async (ind) => ({
          industry: ind,
          workers: await this.prisma.workerProfile.count({
            where: { ...foreignWhere, industries: { has: ind } },
          }),
        })),
      ),
      this.prisma.settlement.count(),
      this.prisma.partnerReferral.count(),
      this.prisma.riskReport.count(),
      this.prisma.trainingRecord.count(),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      foreignWorkers,
      byVisaType: byVisa.map((v) => ({ visaType: v.visaType, count: v._count._all })),
      byKoreanLevel: byKorean.map((k) => ({
        koreanLevel: k.koreanLevel,
        count: k._count._all,
      })),
      byIndustry: (byIndustry as { industry: string; workers: number }[])
        .filter((r) => r.workers > 0)
        .sort((a, b) => b.workers - a.workers),
      totals: { settlements, referrals, riskReports, trainings },
    };
  }

  // ── FieldOps 관심·AI 관심·운영자 관리 (dev-plan §6.5·§6.6) ──

  // FieldOps 관심 — 7종 기능별 분포(0 포함) + 최근 리드 50건(요청자명 포함).
  async listFieldOpsInterests() {
    const [grouped, recent] = await Promise.all([
      this.prisma.fieldOpsInterest.groupBy({
        by: ['feature'],
        _count: { _all: true },
      }),
      this.prisma.fieldOpsInterest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          userId: true,
          feature: true,
          props: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
    ]);
    // 등록 없는 기능도 노출하도록 7종 zero-fill.
    const counts = new Map(grouped.map((g) => [g.feature, g._count._all]));
    const byFeature = Object.values(FieldOpsFeature)
      .map((feature) => ({ feature, count: counts.get(feature) ?? 0 }))
      .sort((a, b) => b.count - a.count);
    return { byFeature, recent };
  }

  // AI 현장리더 관심 — 최근 100건(요청자명 포함) + 산업별 분포.
  async listAiInterests() {
    const [items, grouped] = await Promise.all([
      this.prisma.aiLeaderInterest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { user: { select: { name: true } } },
      }),
      this.prisma.aiLeaderInterest.groupBy({
        by: ['industry'],
        _count: { _all: true },
      }),
    ]);
    const byIndustry = grouped
      .map((g) => ({ industry: g.industry, count: g._count._all }))
      .sort((a, b) => b.count - a.count);
    return { items, byIndustry };
  }

  // 운영자(ProjectOperator) 목록 — 운영자명·소속기업명·산업·지역·예산메모. 최신순.
  listOperators() {
    return this.prisma.projectOperator.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        userId: true,
        companyId: true,
        industries: true,
        regions: true,
        similarExperience: true,
        budgetRangeMemo: true,
        updatedAt: true,
        user: { select: { name: true } },
        company: { select: { name: true } },
      },
    });
  }

  // 행정·노무 파트너 연계 신청 리스트 조회
  async listReferrals() {
    const referrals = await this.prisma.partnerReferral.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const requesterIds = Array.from(new Set(referrals.map((r) => r.requesterId)));
    const users = await this.prisma.user.findMany({
      where: { id: { in: requesterIds } },
      select: { id: true, name: true, phone: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return referrals.map((r) => ({
      ...r,
      user: userMap.get(r.requesterId) || null,
    }));
  }

  // 행정·노무 파트너 연계 신청 상태 변경
  async setReferralStatus(id: string, status: PartnerReferralStatus) {
    const ref = await this.prisma.partnerReferral.findUnique({ where: { id } });
    if (!ref) {
      throw new NotFoundException('신청 정보를 찾을 수 없습니다.');
    }
    return this.prisma.partnerReferral.update({
      where: { id },
      data: { status },
    });
  }
}
