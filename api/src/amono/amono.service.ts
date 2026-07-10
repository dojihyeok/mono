import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceItemDto } from './dto/create-compliance-item.dto';
import { UpdateComplianceItemDto } from './dto/update-compliance-item.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { CreateFieldPassSiteDto } from './dto/create-field-pass-site.dto';
import { UpdateFieldPassSiteDto } from './dto/update-field-pass-site.dto';
import { CreateFieldPassEventDto } from './dto/create-field-pass-event.dto';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

// /amono 관리자 운영·컴플라이언스 모듈(v1.0) — 규제 항목·기능 플래그·Field Pass 운영·감사 로그·알림 CRUD.
@Injectable()
export class AmonoService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 컴플라이언스 항목(ComplianceItem) ──

  findAllComplianceItems() {
    return this.prisma.complianceItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneComplianceItem(id: string) {
    const item = await this.prisma.complianceItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`ComplianceItem ${id} not found`);
    }
    return item;
  }

  createComplianceItem(dto: CreateComplianceItemDto) {
    return this.prisma.complianceItem.create({
      data: {
        ...dto,
        appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : undefined,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
        renewalAt: dto.renewalAt ? new Date(dto.renewalAt) : undefined,
      },
    });
  }

  async updateComplianceItem(id: string, dto: UpdateComplianceItemDto) {
    const existing = await this.prisma.complianceItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`ComplianceItem ${id} not found`);
    }

    const updated = await this.prisma.complianceItem.update({
      where: { id },
      data: {
        ...dto,
        appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : undefined,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
        renewalAt: dto.renewalAt ? new Date(dto.renewalAt) : undefined,
      },
    });

    if (dto.status && dto.status !== existing.status) {
      await this.prisma.auditLog.create({
        data: {
          actor: dto.owner ?? existing.owner ?? 'unknown',
          action: '규제 상태 변경',
          target: `ComplianceItem:${id}`,
          detail: `${existing.name}: ${existing.status} → ${dto.status}`,
        },
      });
    }

    return updated;
  }

  async removeComplianceItem(id: string) {
    try {
      await this.prisma.complianceItem.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`ComplianceItem ${id} not found`);
      }
      throw e;
    }
  }

  // ── 기능 플래그(FeatureFlag) ──

  findAllFeatureFlags() {
    return this.prisma.featureFlag.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateFeatureFlag(key: string, dto: UpdateFeatureFlagDto) {
    const existing = await this.prisma.featureFlag.findUnique({ where: { key } });
    if (!existing) {
      throw new NotFoundException(`FeatureFlag ${key} not found`);
    }

    const updated = await this.prisma.featureFlag.update({
      where: { key },
      data: {
        enabled: dto.enabled,
        updatedBy: dto.updatedBy,
      },
    });

    if (dto.enabled !== existing.enabled) {
      await this.prisma.auditLog.create({
        data: {
          actor: dto.updatedBy ?? 'unknown',
          action: '기능 플래그 변경',
          target: `FeatureFlag:${key}`,
          detail: `${existing.enabled} → ${dto.enabled}`,
        },
      });
    }

    return updated;
  }

  // ── Field Pass 현장(FieldPassSite) ──

  findAllFieldPassSites() {
    return this.prisma.fieldPassSite.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createFieldPassSite(dto: CreateFieldPassSiteDto) {
    return this.prisma.fieldPassSite.create({
      data: {
        ...dto,
        gates: dto.gates as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async updateFieldPassSite(id: string, dto: UpdateFieldPassSiteDto) {
    try {
      return await this.prisma.fieldPassSite.update({
        where: { id },
        data: {
          ...dto,
          gates: dto.gates as Prisma.InputJsonValue | undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`FieldPassSite ${id} not found`);
      }
      throw e;
    }
  }

  // ── Field Pass 인증 이벤트(FieldPassAuthEvent) ──

  findAllFieldPassEvents(siteId?: string) {
    return this.prisma.fieldPassAuthEvent.findMany({
      where: siteId ? { siteId } : undefined,
      orderBy: { occurredAt: 'desc' },
    });
  }

  createFieldPassEvent(dto: CreateFieldPassEventDto) {
    return this.prisma.fieldPassAuthEvent.create({
      data: {
        ...dto,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
      },
    });
  }

  // ── 감사 로그(AuditLog) ──

  findAllAuditLogs(action?: string) {
    return this.prisma.auditLog.findMany({
      where: action ? { action } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  // ── 운영 알림(OperationsAlert) ──

  findAllAlerts() {
    return this.prisma.operationsAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createAlert(dto: CreateAlertDto) {
    return this.prisma.operationsAlert.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async updateAlert(id: string, dto: UpdateAlertDto) {
    try {
      return await this.prisma.operationsAlert.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`OperationsAlert ${id} not found`);
      }
      throw e;
    }
  }
}
