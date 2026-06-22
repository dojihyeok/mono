import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BasicProfileDto } from './dto/basic-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateCareerCardDto } from './dto/create-career-card.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { RegisterInterestDto } from './dto/register-interest.dto';

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
        data: { name: dto.name, phone: dto.phone, email: dto.email },
      });
    } catch (e) {
      // 동시 가입 레이스: unique 충돌(P2002) 시 기존 유저 반환
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        or.length
      ) {
        const existing = await this.prisma.user.findFirst({ where: { OR: or } });
        if (existing) return existing;
      }
      throw e;
    }
  }

  async setBasicProfile(id: string, dto: BasicProfileDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          jobType: dto.jobType,
          careerYears: dto.careerYears,
          region: dto.region,
        },
      });
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
}
