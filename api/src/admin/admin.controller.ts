import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JobPostStatusDto } from './dto/job-post-status.dto';
import { SetUserRoleDto } from './dto/set-user-role.dto';
import { WorkRequestStatusDto } from './dto/work-request-status.dto';
import { CommunityService } from '../community/community.service';

// 운영 콘솔 BFF(/api/admin/*) → 이 컨트롤러.
@Controller('admin')
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly community: CommunityService,
  ) {}

  @Get('overview')
  overview() {
    return this.admin.overview();
  }

  @Get('users')
  users(@Query('limit') limit?: string) {
    return this.admin.listUsers(limit ? Number(limit) : 100);
  }

  // 반장(현장리더) 승인/해제 (User.role → FIELD_LEADER/WORKER, 대기 플래그 정리)
  @Patch('users/:id/role')
  setUserRole(@Param('id') id: string, @Body() dto: SetUserRoleDto) {
    return this.admin.setUserRole(id, dto.role);
  }

  // 반장 승인 대기 목록
  @Get('foreman-requests')
  foremanRequests() {
    return this.admin.listForemanRequests();
  }

  // 반장 신청 반려(승격 없이 대기 해제)
  @Post('users/:id/foreman-reject')
  rejectForeman(@Param('id') id: string) {
    return this.admin.rejectForeman(id);
  }

  @Get('events')
  events(@Query('name') name?: string, @Query('limit') limit?: string) {
    return this.admin.listEvents({
      name: name || undefined,
      limit: limit ? Number(limit) : 100,
    });
  }

  // 채용 공고 관리 — 목록 + 상태 변경(승인/마감)
  @Get('job-posts')
  jobPosts() {
    return this.admin.listJobPosts();
  }

  @Patch('job-posts/:id/status')
  setJobPostStatus(@Param('id') id: string, @Body() dto: JobPostStatusDto) {
    return this.admin.setJobPostStatus(id, dto.status);
  }

  // 작업요청 관리 — 목록 + 상태 변경 (§6.4)
  @Get('work-requests')
  workRequests(@Query('limit') limit?: string) {
    return this.admin.listWorkRequests(limit ? Number(limit) : 100);
  }

  @Patch('work-requests/:id/status')
  setWorkRequestStatus(
    @Param('id') id: string,
    @Body() dto: WorkRequestStatusDto,
  ) {
    return this.admin.setWorkRequestStatus(id, dto.status);
  }

  // 평가 모니터링 (§6.6)
  @Get('reviews')
  reviews(@Query('limit') limit?: string) {
    return this.admin.listReviews(limit ? Number(limit) : 100);
  }

  // PoC 리포트 — 산업별 수요·공급 집계 (§7.3)
  @Get('poc-report')
  pocReport() {
    return this.admin.pocReport();
  }

  // ── 외국인 인력 운영 (dev-plan-foreign-workforce §6·§8) ──
  // 체류 만료 알림 큐
  @Get('expiring-visas')
  expiringVisas(@Query('days') days?: string) {
    return this.admin.listExpiringVisas(days ? Number(days) : 30);
  }

  // 서류 검토 큐
  @Get('pending-documents')
  pendingDocuments() {
    return this.admin.listPendingDocuments();
  }

  // 외국인 인력 투입 리포트
  @Get('foreign-report')
  foreignReport() {
    return this.admin.foreignReport();
  }

  // ── FieldOps 관심·AI 관심·운영자 관리 (§6.5·§6.6) ──
  // FieldOps 관심 분포 + 최근 리드
  @Get('fieldops-interests')
  fieldOpsInterests() {
    return this.admin.listFieldOpsInterests();
  }

  // AI 현장리더 관심 목록 + 산업 분포
  @Get('ai-interests')
  aiInterests() {
    return this.admin.listAiInterests();
  }

  // 운영자(ProjectOperator) 목록
  @Get('operators')
  operators() {
    return this.admin.listOperators();
  }

  // ── 커뮤니티 모니터링 및 금칙어 관리 ──
  @Get('community/reports')
  listCommunityReports() {
    return this.community.listReports();
  }

  @Delete('community/posts/:id')
  deleteCommunityPost(@Param('id') id: string) {
    return this.community.deletePost(id);
  }

  @Get('community/blacklist')
  listBlacklist() {
    return this.community.listBlacklist();
  }

  @Post('community/blacklist')
  addBlacklistWord(@Body() body: { word: string }) {
    return this.community.addBlacklistWord(body.word);
  }

  @Delete('community/blacklist/:id')
  removeBlacklistWord(@Param('id') id: string) {
    return this.community.removeBlacklistWord(id);
  }
}
