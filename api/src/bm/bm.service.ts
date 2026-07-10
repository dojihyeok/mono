import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBmHypothesisDto } from './dto/create-hypothesis.dto';
import { UpdateBmHypothesisDto } from './dto/update-hypothesis.dto';
import { CreateBmExperimentDto } from './dto/create-experiment.dto';
import { UpdateBmExperimentDto } from './dto/update-experiment.dto';
import { CreateBmDecisionLogDto } from './dto/create-decision-log.dto';
import { CreateBmNextActionDto } from './dto/create-next-action.dto';
import { UpdateBmNextActionDto } from './dto/update-next-action.dto';
import { CreateBmRevenueObjectiveDto } from './dto/create-revenue-objective.dto';
import { UpdateBmRevenueObjectiveDto } from './dto/update-revenue-objective.dto';

// /bm 내부 BM 검증 페이지(v1.2) — 수익모델 가설·실험·의사결정·실행액션·매출목표 CRUD.
@Injectable()
export class BmService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 가설(BmHypothesis) ──

  findAllHypotheses() {
    return this.prisma.bmHypothesis.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        experiments: { orderBy: { createdAt: 'desc' } },
        decisions: { orderBy: { createdAt: 'desc' } },
        nextActions: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async findOneHypothesis(id: string) {
    const hypothesis = await this.prisma.bmHypothesis.findUnique({
      where: { id },
      include: {
        experiments: { orderBy: { createdAt: 'desc' } },
        decisions: { orderBy: { createdAt: 'desc' } },
        nextActions: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!hypothesis) {
      throw new NotFoundException(`BmHypothesis ${id} not found`);
    }
    return hypothesis;
  }

  createHypothesis(dto: CreateBmHypothesisDto) {
    return this.prisma.bmHypothesis.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        unitEconomics: dto.unitEconomics as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async updateHypothesis(id: string, dto: UpdateBmHypothesisDto) {
    try {
      return await this.prisma.bmHypothesis.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          unitEconomics: dto.unitEconomics as Prisma.InputJsonValue | undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmHypothesis ${id} not found`);
      }
      throw e;
    }
  }

  async removeHypothesis(id: string) {
    try {
      await this.prisma.bmHypothesis.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmHypothesis ${id} not found`);
      }
      throw e;
    }
  }

  // ── 실험(BmExperiment) ──

  findAllExperiments(hypothesisId?: string) {
    return this.prisma.bmExperiment.findMany({
      where: hypothesisId ? { hypothesisId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  createExperiment(dto: CreateBmExperimentDto) {
    return this.prisma.bmExperiment.create({
      data: {
        ...dto,
        periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
      },
    });
  }

  async updateExperiment(id: string, dto: UpdateBmExperimentDto) {
    try {
      return await this.prisma.bmExperiment.update({
        where: { id },
        data: {
          ...dto,
          periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
          periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmExperiment ${id} not found`);
      }
      throw e;
    }
  }

  async removeExperiment(id: string) {
    try {
      await this.prisma.bmExperiment.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmExperiment ${id} not found`);
      }
      throw e;
    }
  }

  // ── 의사결정 로그(BmDecisionLog) ──

  findAllDecisionLogs(hypothesisId?: string) {
    return this.prisma.bmDecisionLog.findMany({
      where: hypothesisId ? { hypothesisId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  createDecisionLog(dto: CreateBmDecisionLogDto) {
    return this.prisma.bmDecisionLog.create({
      data: {
        ...dto,
        nextReviewAt: dto.nextReviewAt ? new Date(dto.nextReviewAt) : undefined,
      },
    });
  }

  // ── 다음 실행 액션(BmNextAction) ──

  findAllNextActions() {
    return this.prisma.bmNextAction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createNextAction(dto: CreateBmNextActionDto) {
    return this.prisma.bmNextAction.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async updateNextAction(id: string, dto: UpdateBmNextActionDto) {
    try {
      return await this.prisma.bmNextAction.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmNextAction ${id} not found`);
      }
      throw e;
    }
  }

  async removeNextAction(id: string) {
    try {
      await this.prisma.bmNextAction.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmNextAction ${id} not found`);
      }
      throw e;
    }
  }

  // ── 매출 목표(BmRevenueObjective) ──

  findAllRevenueObjectives() {
    return this.prisma.bmRevenueObjective.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createRevenueObjective(dto: CreateBmRevenueObjectiveDto) {
    return this.prisma.bmRevenueObjective.create({ data: dto });
  }

  async updateRevenueObjective(id: string, dto: UpdateBmRevenueObjectiveDto) {
    try {
      return await this.prisma.bmRevenueObjective.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmRevenueObjective ${id} not found`);
      }
      throw e;
    }
  }

  async removeRevenueObjective(id: string) {
    try {
      await this.prisma.bmRevenueObjective.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`BmRevenueObjective ${id} not found`);
      }
      throw e;
    }
  }
}
