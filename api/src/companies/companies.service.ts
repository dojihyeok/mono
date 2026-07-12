import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { SaveWorkerDto } from './dto/save-worker.dto';
import { CreateWorkRecordDto } from './dto/create-work-record.dto';
import { CreateConsultRequestDto } from './dto/create-consult-request.dto';
import {
  IndustryType,
  KoreanLevel,
  Residency,
  VisaType,
} from '@prisma/client';

// 기업(수요측) 도메인 — 기업용 웹(/partner). Demand-first.
@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  // 기업 신청/등록 (status INQUIRY). companyKind 미지정 시 DB 기본값 PERFORMER.
  createCompany(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        industry: dto.industry,
        region: dto.region ?? [],
        companyKind: dto.companyKind,
        industries: dto.industries ?? [],
        safetyRate: dto.safetyRate,
        rehireRate: dto.rehireRate,
        memo: dto.memo,
      },
    });
  }

  async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { _count: { select: { jobPosts: true, savedWorkers: true } } },
    });
    if (!company) throw new NotFoundException(`Company ${id} not found`);
    return company;
  }

  // 기업 로그인 — 신청 연락처로 기존 협약 조회(데모: 비밀번호 없음, 가장 최근 1건)
  async loginByPhone(contactPhone: string) {
    const company = await this.prisma.company.findFirst({
      where: { contactPhone },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { jobPosts: true, savedWorkers: true } } },
    });
    if (!company) {
      throw new NotFoundException('해당 연락처로 신청된 협약을 찾을 수 없습니다.');
    }
    return company;
  }

  private async ensureCompany(id: string): Promise<void> {
    const c = await this.prisma.company.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Company ${id} not found`);
  }

  // 채용 공고 선등록 (status PENDING). 첫 공고 시 기업 상태를 '공고 등록'으로 승급.
  async createJobPost(companyId: string, dto: CreateJobPostDto) {
    await this.ensureCompany(companyId);
    const post = await this.prisma.jobPost.create({
      data: {
        companyId,
        title: dto.title,
        jobType: dto.jobType,
        headcount: dto.headcount,
        careerBand: dto.careerBand,
        certs: dto.certs ?? [],
        region: dto.region,
        period: dto.period,
        conditions: dto.conditions,
        isUrgent: dto.isUrgent ?? false,
        siteType: dto.siteType,
      },
    });
    await this.prisma.company.updateMany({
      where: {
        id: companyId,
        status: { in: ['INQUIRY', 'REVIEWING', 'PARTNER_CANDIDATE'] },
      },
      data: { status: 'POSTED' },
    });
    return post;
  }

  listJobPosts(companyId: string) {
    return this.prisma.jobPost.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 공고 삭제 — 본인(해당 기업) 공고만. 지원/출역(JobApplication·Attendance)은 cascade 삭제.
  async deleteJobPost(companyId: string, postId: string) {
    const res = await this.prisma.jobPost.deleteMany({
      where: { id: postId, companyId },
    });
    if (res.count === 0) {
      throw new NotFoundException(`JobPost ${postId} not found for company ${companyId}`);
    }
    return { ok: true, deleted: res.count };
  }

  // 관심 기술자 저장 (idempotent — unique companyId+userId)
  async saveWorker(companyId: string, dto: SaveWorkerDto) {
    await this.ensureCompany(companyId);
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
    return this.prisma.savedWorker.upsert({
      where: { companyId_userId: { companyId, userId: dto.userId } },
      create: { companyId, userId: dto.userId, memo: dto.memo },
      update: { memo: dto.memo },
    });
  }

  async unsaveWorker(companyId: string, userId: string) {
    await this.prisma.savedWorker.deleteMany({ where: { companyId, userId } });
    return { ok: true };
  }

  // 저장한 기술자 목록 — 공개 화이트리스트(민감정보 제외) + 등록 요약.
  listSaved(companyId: string) {
    return this.prisma.savedWorker.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            jobType: true,
            careerYears: true,
            region: true,
            createdAt: true,
            _count: {
              select: { careerCards: true, certificates: true, educations: true },
            },
          },
        },
      },
    });
  }

  // 기술자용 채용 공고 조회 — 마감(CLOSED) 제외 + 회사명/지역 동반. 직군/지역 필터.
  browseJobPosts(params: { jobType?: string; region?: string; limit?: number }) {
    const { jobType, region, limit = 50 } = params;
    // 기술자에겐 관리자가 승인(OPEN)한 공고만 노출
    const where: Prisma.JobPostWhereInput = { status: 'OPEN' };
    if (jobType) where.jobType = { has: jobType };
    if (region) where.region = { has: region };
    return this.prisma.jobPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
      select: {
        id: true,
        title: true,
        jobType: true,
        headcount: true,
        careerBand: true,
        certs: true,
        region: true,
        period: true,
        conditions: true,
        status: true,
        createdAt: true,
        source: true,
        sourceRawText: true,
        company: { select: { name: true, region: true, contactPhone: true } },
      },
    });
  }

  // 샘플 기술자 프로필 조회 — 공개 화이트리스트(휴대폰/이메일/발급번호/coworkers/memo 제외).
  browseWorkers(params: { jobType?: string; region?: string; limit?: number }) {
    const { jobType, region, limit = 50 } = params;
    const where: Prisma.UserWhereInput = { name: { not: null } };
    if (jobType) where.jobType = { has: jobType };
    if (region) where.region = { has: region };
    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
      select: {
        id: true,
        name: true,
        jobType: true,
        careerYears: true,
        region: true,
        createdAt: true,
        careerCards: {
          select: { siteName: true, field: true },
          orderBy: { startDate: 'asc' },
          take: 5,
        },
        _count: {
          select: { careerCards: true, certificates: true, educations: true },
        },
      },
    });
  }

  // ── 작업수행사례(WorkRecord) — §4-4 스프린트3 ──

  async createWorkRecord(companyId: string, dto: CreateWorkRecordDto) {
    await this.ensureCompany(companyId);
    return this.prisma.workRecord.create({
      data: {
        companyId,
        industry: dto.industry,
        title: dto.title,
        siteName: dto.siteName,
        workTypes: dto.workTypes ?? [],
        period: dto.period,
        scaleMemo: dto.scaleMemo,
        description: dto.description,
      },
    });
  }

  listWorkRecords(companyId: string) {
    return this.prisma.workRecord.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 작업수행사례 삭제 — 본인(해당 기업) 사례만. 멱등.
  async deleteWorkRecord(companyId: string, rid: string) {
    const res = await this.prisma.workRecord.deleteMany({
      where: { id: rid, companyId },
    });
    if (res.count === 0) {
      throw new NotFoundException(
        `WorkRecord ${rid} not found for company ${companyId}`,
      );
    }
    return { ok: true, deleted: res.count };
  }

  // 수행기업 공개 프로필 — 회사 기본정보 + 작업수행사례 + 안전/재의뢰 지표 집계.
  async getCompanyProfile(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        companyKind: true,
        industry: true,
        industries: true,
        region: true,
        safetyRate: true,
        rehireRate: true,
        defectMemo: true,
        status: true,
        createdAt: true,
        _count: { select: { workRecords: true, jobPosts: true } },
      },
    });
    if (!company) throw new NotFoundException(`Company ${id} not found`);
    const workRecords = await this.prisma.workRecord.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return { company, workRecords };
  }

  // 수행기업 디렉터리(운영자/발주측 후보조회) — 산업/지역 필터, 최신순. §4-4 P1.
  listPerformers(params: {
    industry?: IndustryType;
    region?: string;
    limit?: number;
  }) {
    const { industry, region, limit = 50 } = params;
    const where: Prisma.CompanyWhereInput = { companyKind: 'PERFORMER' };
    if (industry) where.industries = { has: industry };
    if (region) where.region = { has: region };
    return this.prisma.company.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
      select: {
        id: true,
        name: true,
        industry: true,
        industries: true,
        region: true,
        safetyRate: true,
        rehireRate: true,
        createdAt: true,
        _count: { select: { workRecords: true } },
      },
    });
  }

  // ── 외국인 기술자 후보 검색 (dev-plan-foreign-workforce §5-5·§8-3) ──
  // 외국인(국적/거주구분 등록) + 비자·언어·산업·지역 필터. 비자·언어 수준·통역가능 포함.
  // 주의: 정보 제공용 검색 — 직업소개·파견 아님(§0 법무 경계).
  browseForeignWorkers(params: {
    koreanLevel?: KoreanLevel;
    residency?: Residency;
    visaType?: VisaType;
    industry?: IndustryType;
    region?: string;
    interpreterNeeded?: boolean;
    limit?: number;
  }) {
    const { koreanLevel, residency, visaType, industry, region, interpreterNeeded, limit = 50 } =
      params;
    // 외국인 판정 = 거주구분 OVERSEAS 이거나 국적이 등록된 자.
    // (온보딩서 내국인=DOMESTIC 도 저장 → residency!=null 은 내국인 포함됨 → OVERSEAS 로 한정)
    const wp: Prisma.WorkerProfileWhereInput = {
      OR: [{ residency: Residency.OVERSEAS }, { nationality: { not: null } }],
    };
    if (koreanLevel) wp.koreanLevel = koreanLevel;
    if (residency) wp.residency = residency;
    if (industry) wp.industries = { has: industry };
    if (interpreterNeeded !== undefined) wp.interpreterNeeded = interpreterNeeded;

    const where: Prisma.UserWhereInput = {
      name: { not: null },
      workerProfile: { is: wp },
    };
    if (region) where.region = { has: region };
    if (visaType) where.visaStatuses = { some: { visaType } };

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(Number.isFinite(limit) ? limit : 50, 1), 200),
      select: {
        id: true,
        name: true,
        jobType: true,
        careerYears: true,
        region: true,
        createdAt: true,
        workerProfile: {
          select: {
            nationality: true,
            residency: true,
            languages: true,
            koreanLevel: true,
            interpreterNeeded: true,
            industries: true,
          },
        },
        visaStatuses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { visaType: true, status: true, expiryDate: true },
        },
        _count: {
          select: { careerCards: true, certificates: true, trainingRecords: true },
        },
      },
    });
  }

  // ── 면접/상담 요청 (ConsultRequest) ──
  async createConsultRequest(companyId: string, dto: CreateConsultRequestDto) {
    // Check company exists
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException(`Company ${companyId} not found`);

    if (!dto.targetUserId) {
      throw new Error('targetUserId must be provided');
    }

    return this.prisma.consultRequest.create({
      data: {
        companyId,
        targetUserId: dto.targetUserId,
        memo: dto.memo,
      },
    });
  }

  async listConsultRequestsByCompany(companyId: string) {
    return this.prisma.consultRequest.findMany({
      where: { companyId },
      include: {
        targetUser: { select: { id: true, name: true, region: true, jobType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
