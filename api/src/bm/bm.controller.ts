import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BmService } from './bm.service';
import { CreateBmHypothesisDto } from './dto/create-hypothesis.dto';
import { UpdateBmHypothesisDto } from './dto/update-hypothesis.dto';
import { CreateBmExperimentDto } from './dto/create-experiment.dto';
import { UpdateBmExperimentDto } from './dto/update-experiment.dto';
import { CreateBmDecisionLogDto } from './dto/create-decision-log.dto';
import { CreateBmNextActionDto } from './dto/create-next-action.dto';
import { UpdateBmNextActionDto } from './dto/update-next-action.dto';
import { CreateBmRevenueObjectiveDto } from './dto/create-revenue-objective.dto';
import { UpdateBmRevenueObjectiveDto } from './dto/update-revenue-objective.dto';

// /bm 내부 BM 검증 페이지(v1.2) BFF → 이 컨트롤러. 인증/마스킹은 Next.js 프록시 레이어에서 처리.
@Controller('bm')
export class BmController {
  constructor(private readonly bm: BmService) {}

  // ── 가설 ──

  @Get('hypotheses')
  findAllHypotheses() {
    return this.bm.findAllHypotheses();
  }

  @Post('hypotheses')
  createHypothesis(@Body() dto: CreateBmHypothesisDto) {
    return this.bm.createHypothesis(dto);
  }

  @Get('hypotheses/:id')
  findOneHypothesis(@Param('id') id: string) {
    return this.bm.findOneHypothesis(id);
  }

  @Patch('hypotheses/:id')
  updateHypothesis(@Param('id') id: string, @Body() dto: UpdateBmHypothesisDto) {
    return this.bm.updateHypothesis(id, dto);
  }

  @Delete('hypotheses/:id')
  removeHypothesis(@Param('id') id: string) {
    return this.bm.removeHypothesis(id);
  }

  // ── 실험 ──

  @Get('experiments')
  findAllExperiments(@Query('hypothesisId') hypothesisId?: string) {
    return this.bm.findAllExperiments(hypothesisId);
  }

  @Post('experiments')
  createExperiment(@Body() dto: CreateBmExperimentDto) {
    return this.bm.createExperiment(dto);
  }

  @Patch('experiments/:id')
  updateExperiment(@Param('id') id: string, @Body() dto: UpdateBmExperimentDto) {
    return this.bm.updateExperiment(id, dto);
  }

  @Delete('experiments/:id')
  removeExperiment(@Param('id') id: string) {
    return this.bm.removeExperiment(id);
  }

  // ── 의사결정 로그 ──

  @Get('decisions')
  findAllDecisionLogs(@Query('hypothesisId') hypothesisId?: string) {
    return this.bm.findAllDecisionLogs(hypothesisId);
  }

  @Post('decisions')
  createDecisionLog(@Body() dto: CreateBmDecisionLogDto) {
    return this.bm.createDecisionLog(dto);
  }

  // ── 다음 실행 액션 ──

  @Get('next-actions')
  findAllNextActions() {
    return this.bm.findAllNextActions();
  }

  @Post('next-actions')
  createNextAction(@Body() dto: CreateBmNextActionDto) {
    return this.bm.createNextAction(dto);
  }

  @Patch('next-actions/:id')
  updateNextAction(@Param('id') id: string, @Body() dto: UpdateBmNextActionDto) {
    return this.bm.updateNextAction(id, dto);
  }

  @Delete('next-actions/:id')
  removeNextAction(@Param('id') id: string) {
    return this.bm.removeNextAction(id);
  }

  // ── 매출 목표 ──

  @Get('revenue-objectives')
  findAllRevenueObjectives() {
    return this.bm.findAllRevenueObjectives();
  }

  @Post('revenue-objectives')
  createRevenueObjective(@Body() dto: CreateBmRevenueObjectiveDto) {
    return this.bm.createRevenueObjective(dto);
  }

  @Patch('revenue-objectives/:id')
  updateRevenueObjective(@Param('id') id: string, @Body() dto: UpdateBmRevenueObjectiveDto) {
    return this.bm.updateRevenueObjective(id, dto);
  }

  @Delete('revenue-objectives/:id')
  removeRevenueObjective(@Param('id') id: string) {
    return this.bm.removeRevenueObjective(id);
  }
}
