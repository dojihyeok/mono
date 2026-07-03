import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BasicProfileDto } from './dto/basic-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateCareerCardDto } from './dto/create-career-card.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { RegisterInterestDto } from './dto/register-interest.dto';
import { FieldLeaderProfileDto } from './dto/field-leader-profile.dto';
import { WorkerProfileDto } from './dto/worker-profile.dto';
import { OperatorProfileDto } from './dto/operator-profile.dto';
import { VisaStatusDto } from './dto/visa-status.dto';
import { DocumentRecordDto } from './dto/document-record.dto';
import { CreateEquipmentHistoryDto } from './dto/create-equipment-history.dto';
import { UpdateConsultRequestDto } from './dto/update-consult-request.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 가입(idempotent): phone/email 은 unique. 같은 연락처 재가입이면 기존 유저 반환 → 중복가입 방지.
  async signup(dto: SignupDto) {
    const or: Prisma.UserWhereInput[] = [];
    if (dto.phone) or.push({ phone: dto.phone });
    if (dto.email) or.push({ email: dto.email });

    if (or.length) {
      const existing = await this.prisma.user.findFirst({ where: { OR: or } });
      if (existing) return existing;
    }

    try {
      return await this.prisma.user.create({
        data: { name: dto.name, phone: dto.phone, email: dto.email, role: dto.role },
      });
    } catch (e) {
      // 동시 가입 레이스: unique 충돌(P2002) → 충돌한 필드(phone/email)를 정확히 집어 그 유저 반환.
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = (e.meta?.target as string[] | undefined) ?? [];
        if (target.includes('phone') && dto.phone) {
          const u = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
          if (u) return u;
        }
        if (target.includes('email') && dto.email) {
          const u = await this.prisma.user.findUnique({ where: { email: dto.email } });
          if (u) return u;
        }
        // 폴백: OR 재조회
        if (or.length) {
          const existing = await this.prisma.user.findFirst({ where: { OR: or } });
          if (existing) return existing;
        }
      }
      throw e;
    }
  }

  async setBasicProfile(id: string, dto: BasicProfileDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          // 이름은 전달된 경우에만 갱신.
          ...(dto.name ? { name: dto.name } : {}),
          // 유형 자가선택(WORKER/CUSTOMER만 DTO에서 허용). FIELD_LEADER 등은 관리자 승인 경로.
          ...(dto.role ? { role: dto.role } : {}),
          // 직군은 전달된 경우에만(CUSTOMER는 직군 없음 → 미전달).
          ...(dto.jobType ? { jobType: dto.jobType } : {}),
          careerYears: dto.careerYears,
          region: dto.region,
          // 산업유형은 전달된 경우에만 갱신(미전달 시 기존 유지)
          ...(dto.industries ? { industries: dto.industries } : {}),
        },
      });
      // 내국인/외국인 — WorkerProfile(1:1)에 영속. 전달된 경우에만 upsert(다른 필드 보존).
      if (dto.residency) {
        await this.prisma.workerProfile.upsert({
          where: { userId: id },
          create: { userId: id, residency: dto.residency },
          update: { residency: dto.residency },
        });
      }
      return user;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`User ${id} not found`);
      }
      throw e;
    }
  }

  // 회원(userId) 존재 확인 — 자식 엔티티 생성 전 FK 무결성 보장
  private async ensureUser(userId: string): Promise<void> {
    const u = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!u) throw new NotFoundException(`User ${userId} not found`);
  }

  // 자격증 등록 (Certificate, FK userId → User.id)
  async addCertificate(userId: string, dto: CreateCertificateDto) {
    await this.ensureUser(userId);
    return this.prisma.certificate.create({
      data: {
        userId,
        name: dto.name,
        licenseNo: dto.licenseNo,
        issuer: dto.issuer,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
      },
    });
  }

  // 경력 카드 등록 (CareerCard, FK userId → User.id)
  async addCareerCard(userId: string, dto: CreateCareerCardDto) {
    await this.ensureUser(userId);
    return this.prisma.careerCard.create({
      data: {
        userId,
        siteName: dto.siteName,
        field: dto.field,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        role: dto.role,
        equipment: dto.equipment,
        coworkers: dto.coworkers,
        memo: dto.memo,
      },
    });
  }

  // 교육 이력 등록 (Education, FK userId → User.id)
  async addEducation(userId: string, dto: CreateEducationDto) {
    await this.ensureUser(userId);
    return this.prisma.education.create({
      data: {
        userId,
        title: dto.title,
        institute: dto.institute,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      },
    });
  }

  // 공개 프로필 조회 — 공유 링크(/p/:id)용. 휴대폰/이메일·발급번호 등 민감정보는 제외.
  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        jobType: true,
        careerYears: true,
        region: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const [careerCards, certificates, educations] = await Promise.all([
      this.prisma.careerCard.findMany({
        where: { userId },
        // coworkers(제3자 실명)·memo(사적 메모)는 공개하지 않음 — 화이트리스트만 반환
        select: {
          id: true,
          siteName: true,
          field: true,
          startDate: true,
          endDate: true,
          role: true,
          equipment: true,
          createdAt: true,
        },
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.certificate.findMany({
        where: { userId },
        // 발급번호(licenseNo)는 공개하지 않음
        select: {
          id: true,
          name: true,
          issuer: true,
          issuedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.education.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return { user, careerCards, certificates, educations };
  }

  // 본인 프로필(역할·반장신청 여부 포함) — 클라이언트 권한 게이트용. 없으면 null.
  async getMe(id: string) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        foremanRequested: true,
        jobType: true,
        careerYears: true,
        region: true,
        industries: true,
        // 내국인/외국인 read-back — WorkerProfile.residency 평탄화.
        workerProfile: { select: { residency: true } },
      },
    });
    if (!u) return null;
    const { workerProfile, ...rest } = u;
    return { ...rest, residency: workerProfile?.residency ?? null };
  }

  // 반장 승인 요청 — 기능공이 신청(대기). 관리자가 승인/반려로 해제. 멱등.
  async requestForeman(id: string) {
    try {
      const u = await this.prisma.user.update({
        where: { id },
        data: { foremanRequested: true },
        select: { id: true, role: true, foremanRequested: true },
      });
      return { ok: true, role: u.role, foremanRequested: u.foremanRequested };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`User ${id} not found`);
      }
      throw e;
    }
  }

  // 현장리더 프로필 upsert — FieldLeaderProfile(userId @unique). 부분 갱신(미전달 필드는 update 시 무시).
  async upsertFieldLeaderProfile(userId: string, dto: FieldLeaderProfileDto) {
    await this.ensureUser(userId);
    return this.prisma.fieldLeaderProfile.upsert({
      where: { userId },
      // 생성 시: 미전달 스칼라 배열은 Prisma 기본값(빈 배열)으로 들어감
      create: {
        userId,
        primaryJobTypes: dto.primaryJobTypes,
        manageableTeamSize: dto.manageableTeamSize,
        mainWorkFields: dto.mainWorkFields,
        industries: dto.industries,
        regions: dto.regions,
        partnerCompanyIds: dto.partnerCompanyIds,
        contactHours: dto.contactHours,
      },
      // 갱신 시: undefined 필드는 Prisma 가 무시 → 기존 값 유지
      update: {
        primaryJobTypes: dto.primaryJobTypes,
        manageableTeamSize: dto.manageableTeamSize,
        mainWorkFields: dto.mainWorkFields,
        industries: dto.industries,
        regions: dto.regions,
        partnerCompanyIds: dto.partnerCompanyIds,
        contactHours: dto.contactHours,
      },
    });
  }

  // 현장리더 프로필 조회 — 없으면 null 반환(에러 아님).
  async getFieldLeaderProfile(userId: string) {
    return this.prisma.fieldLeaderProfile.findUnique({ where: { userId } });
  }

  // 기술자 확장 프로필 upsert — WorkerProfile(userId @unique). 부분 갱신(undefined 무시).
  async upsertWorkerProfile(userId: string, dto: WorkerProfileDto) {
    await this.ensureUser(userId);
    // 외국인 속성 포함(dev-plan-foreign-workforce). desiredEntryDate 는 ISO → Date.
    const foreign = {
      residency: dto.residency,
      nationality: dto.nationality,
      languages: dto.languages,
      koreanLevel: dto.koreanLevel,
      interpreterNeeded: dto.interpreterNeeded,
      glossaryComprehension: dto.glossaryComprehension,
      desiredEntryDate: dto.desiredEntryDate
        ? new Date(dto.desiredEntryDate)
        : undefined,
    };
    return this.prisma.workerProfile.upsert({
      where: { userId },
      create: {
        userId,
        industries: dto.industries,
        preferredWorkTypes: dto.preferredWorkTypes,
        similarWorkExperience: dto.similarWorkExperience,
        contactHours: dto.contactHours,
        introduction: dto.introduction,
        ...foreign,
      },
      update: {
        industries: dto.industries,
        preferredWorkTypes: dto.preferredWorkTypes,
        similarWorkExperience: dto.similarWorkExperience,
        contactHours: dto.contactHours,
        introduction: dto.introduction,
        ...foreign,
      },
    });
  }

  async getWorkerProfile(userId: string) {
    return this.prisma.workerProfile.findUnique({ where: { userId } });
  }

  // 운영자 프로필 upsert — ProjectOperator(userId @unique). 부분 갱신(undefined 무시).
  async upsertOperatorProfile(userId: string, dto: OperatorProfileDto) {
    await this.ensureUser(userId);
    return this.prisma.projectOperator.upsert({
      where: { userId },
      create: {
        userId,
        companyId: dto.companyId,
        industries: dto.industries,
        regions: dto.regions,
        similarExperience: dto.similarExperience,
        leaderPoolIds: dto.leaderPoolIds,
        budgetRangeMemo: dto.budgetRangeMemo,
      },
      update: {
        companyId: dto.companyId,
        industries: dto.industries,
        regions: dto.regions,
        similarExperience: dto.similarExperience,
        leaderPoolIds: dto.leaderPoolIds,
        budgetRangeMemo: dto.budgetRangeMemo,
      },
    });
  }

  async getOperatorProfile(userId: string) {
    return this.prisma.projectOperator.findUnique({ where: { userId } });
  }

  // 장비 이력 등록 (EquipmentHistory, FK userId → User.id)
  async addEquipmentHistory(userId: string, dto: CreateEquipmentHistoryDto) {
    await this.ensureUser(userId);
    return this.prisma.equipmentHistory.create({
      data: {
        userId,
        name: dto.name,
        category: dto.category,
        proficient: dto.proficient,
        yearsUsed: dto.yearsUsed,
        memo: dto.memo,
      },
    });
  }

  // 장비 이력 목록(최신순)
  listEquipmentHistory(userId: string) {
    return this.prisma.equipmentHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 장비 이력 삭제 — 본인(userId) 소유 항목만. 멱등.
  async deleteEquipmentHistory(userId: string, eid: string) {
    await this.prisma.equipmentHistory.deleteMany({
      where: { id: eid, userId },
    });
    return { ok: true };
  }

  // 회원 탈퇴 — User 삭제. 연관 데이터(경력·자격·팀·동료·알림·지원 등)는 onDelete: Cascade 로 함께 삭제.
  async deleteUser(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      // 이미 없는 계정이면 멱등하게 성공 처리
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return { ok: true };
      }
      throw e;
    }
  }

  // 관심 기능 등록 (InterestRegistration, FK userId → User.id) — idempotent
  async registerInterest(userId: string, dto: RegisterInterestDto) {
    await this.ensureUser(userId);
    const existing = await this.prisma.interestRegistration.findFirst({
      where: { userId, feature: dto.feature },
    });
    if (existing) return existing;
    return this.prisma.interestRegistration.create({
      data: { userId, feature: dto.feature },
    });
  }

  // ── 외국인 체류·비자 (dev-plan-foreign-workforce §6) ──
  // 비자 상태 등록 — 이력 보존(1:N). 목록의 최신 1건이 "현재 비자".
  async createVisa(userId: string, dto: VisaStatusDto) {
    await this.ensureUser(userId);
    return this.prisma.visaStatus.create({
      data: {
        userId,
        visaType: dto.visaType,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        renewalDueDate: dto.renewalDueDate
          ? new Date(dto.renewalDueDate)
          : undefined,
        workScope: dto.workScope,
        workplaceChangeable: dto.workplaceChangeable,
        arcNumber: dto.arcNumber,
        status: dto.status,
      },
    });
  }

  // 비자 이력 목록(최신순) — [0] = 현재 비자.
  listVisa(userId: string) {
    return this.prisma.visaStatus.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 서류 업로드 (DocumentRecord, §6-3)
  async addDocument(userId: string, dto: DocumentRecordDto) {
    await this.ensureUser(userId);
    return this.prisma.documentRecord.create({
      data: {
        userId,
        kind: dto.kind,
        fileUrl: dto.fileUrl,
        status: dto.status,
      },
    });
  }

  // 서류 목록(최신순)
  listDocuments(userId: string) {
    return this.prisma.documentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── 공고 저장 (SavedJob) ──
  async addSavedJob(userId: string, jobPostId: string) {
    await this.ensureUser(userId);
    // Check if job exists
    const job = await this.prisma.jobPost.findUnique({ where: { id: jobPostId } });
    if (!job) throw new NotFoundException(`Job ${jobPostId} not found`);

    const existing = await this.prisma.savedJob.findUnique({
      where: { userId_jobPostId: { userId, jobPostId } },
    });
    if (existing) return existing;

    return this.prisma.savedJob.create({
      data: { userId, jobPostId },
    });
  }

  async removeSavedJob(userId: string, jobPostId: string) {
    try {
      await this.prisma.savedJob.delete({
        where: { userId_jobPostId: { userId, jobPostId } },
      });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return { ok: true }; // already removed
      }
      throw e;
    }
  }

  listSavedJobs(userId: string) {
    return this.prisma.savedJob.findMany({
      where: { userId },
      include: {
        jobPost: {
          include: {
            company: { select: { id: true, name: true, region: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── 면접/상담 요청 (ConsultRequest) 확인 및 응답 ──
  async listConsultRequests(userId: string) {
    await this.ensureUser(userId);
    return this.prisma.consultRequest.findMany({
      where: { targetUserId: userId },
      include: {
        company: { select: { id: true, name: true, region: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateConsultRequest(
    userId: string,
    reqId: string,
    dto: UpdateConsultRequestDto,
  ) {
    await this.ensureUser(userId);
    const req = await this.prisma.consultRequest.findUnique({ where: { id: reqId } });
    if (!req) throw new NotFoundException(`ConsultRequest ${reqId} not found`);
    if (req.targetUserId !== userId) {
      throw new Error(`ConsultRequest ${reqId} does not belong to user ${userId}`);
    }

    return this.prisma.consultRequest.update({
      where: { id: reqId },
      data: { status: dto.status },
    });
  }

  // ── 현장 운영: 체크인 (FieldCheckin) ──
  async addCheckin(userId: string, data: { type: any; workDate: string; memo?: string }) {
    // CheckinType validation is handled by DTO typically, but we trust the input here or ensure it in controller.
    return this.prisma.fieldCheckin.create({
      data: {
        userId,
        type: data.type,
        workDate: data.workDate,
        memo: data.memo,
      },
    });
  }

  async listCheckins(userId: string, workDate?: string) {
    return this.prisma.fieldCheckin.findMany({
      where: {
        userId,
        ...(workDate ? { workDate } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
