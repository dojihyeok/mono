import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AmonoService } from './amono.service';
import { CreateComplianceItemDto } from './dto/create-compliance-item.dto';
import { UpdateComplianceItemDto } from './dto/update-compliance-item.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { CreateFieldPassSiteDto } from './dto/create-field-pass-site.dto';
import { UpdateFieldPassSiteDto } from './dto/update-field-pass-site.dto';
import { CreateFieldPassEventDto } from './dto/create-field-pass-event.dto';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

// /amono 관리자 운영·컴플라이언스 콘솔(v1.0) BFF → 이 컨트롤러. 인증/마스킹은 Next.js 프록시 레이어에서 처리.
@Controller('amono')
export class AmonoController {
  constructor(private readonly amono: AmonoService) {}

  // ── 컴플라이언스 항목 ──

  @Get('compliance-items')
  findAllComplianceItems() {
    return this.amono.findAllComplianceItems();
  }

  @Post('compliance-items')
  createComplianceItem(@Body() dto: CreateComplianceItemDto) {
    return this.amono.createComplianceItem(dto);
  }

  @Get('compliance-items/:id')
  findOneComplianceItem(@Param('id') id: string) {
    return this.amono.findOneComplianceItem(id);
  }

  @Patch('compliance-items/:id')
  updateComplianceItem(@Param('id') id: string, @Body() dto: UpdateComplianceItemDto) {
    return this.amono.updateComplianceItem(id, dto);
  }

  @Delete('compliance-items/:id')
  removeComplianceItem(@Param('id') id: string) {
    return this.amono.removeComplianceItem(id);
  }

  // ── 기능 플래그 ──

  @Get('feature-flags')
  findAllFeatureFlags() {
    return this.amono.findAllFeatureFlags();
  }

  @Patch('feature-flags/:key')
  updateFeatureFlag(@Param('key') key: string, @Body() dto: UpdateFeatureFlagDto) {
    return this.amono.updateFeatureFlag(key, dto);
  }

  // ── Field Pass 현장 ──

  @Get('field-pass-sites')
  findAllFieldPassSites() {
    return this.amono.findAllFieldPassSites();
  }

  @Post('field-pass-sites')
  createFieldPassSite(@Body() dto: CreateFieldPassSiteDto) {
    return this.amono.createFieldPassSite(dto);
  }

  @Patch('field-pass-sites/:id')
  updateFieldPassSite(@Param('id') id: string, @Body() dto: UpdateFieldPassSiteDto) {
    return this.amono.updateFieldPassSite(id, dto);
  }

  // ── Field Pass 인증 이벤트 ──

  @Get('field-pass-events')
  findAllFieldPassEvents(@Query('siteId') siteId?: string) {
    return this.amono.findAllFieldPassEvents(siteId);
  }

  @Post('field-pass-events')
  createFieldPassEvent(@Body() dto: CreateFieldPassEventDto) {
    return this.amono.createFieldPassEvent(dto);
  }

  // ── 감사 로그 ──

  @Get('audit-logs')
  findAllAuditLogs(@Query('action') action?: string) {
    return this.amono.findAllAuditLogs(action);
  }

  // ── 운영 알림 ──

  @Get('alerts')
  findAllAlerts() {
    return this.amono.findAllAlerts();
  }

  @Post('alerts')
  createAlert(@Body() dto: CreateAlertDto) {
    return this.amono.createAlert(dto);
  }

  @Patch('alerts/:id')
  updateAlert(@Param('id') id: string, @Body() dto: UpdateAlertDto) {
    return this.amono.updateAlert(id, dto);
  }
}
