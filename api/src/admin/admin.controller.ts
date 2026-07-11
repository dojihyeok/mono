import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JobPostStatusDto } from './dto/job-post-status.dto';
import { SetUserRoleDto } from './dto/set-user-role.dto';
import { WorkRequestStatusDto } from './dto/work-request-status.dto';
import { CommunityService } from '../community/community.service';
import { PartnerReferralStatus, LeadStage, SitePrepStatus } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { ReviewSitePrepDto } from './dto/review-site-prep.dto';
import { CreateCrawledJobPostDto } from './dto/create-crawled-job-post.dto';

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

  // 외부 카페/밴드 크롤링 공고 등록(크롤러 스크립트 전용, status PENDING으로 생성)
  @Post('job-posts/crawled')
  createCrawledJobPost(@Body() dto: CreateCrawledJobPostDto) {
    return this.admin.createCrawledJobPost(dto);
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

  // 후보 관리(BM 검증 P0-2) — 관심 기술자 저장 + 상담 요청 현황
  @Get('candidates')
  candidates(@Query('limit') limit?: string) {
    return this.admin.listCandidates(limit ? Number(limit) : 100);
  }

  // 팀 관리(BM 검증 P0-3) — 팀 + 팀원 + 반장
  @Get('teams')
  teams(@Query('limit') limit?: string) {
    return this.admin.listTeams(limit ? Number(limit) : 100);
  }

  // 현장 준비 서류 검토(Field Pass P0) — 자가신고 제출 목록 조회 + 승인/반려
  @Get('site-prep')
  listSitePrep(@Query('status') status?: SitePrepStatus, @Query('limit') limit?: string) {
    return this.admin.listSitePrepItems(status, limit ? Number(limit) : 200);
  }

  @Patch('site-prep/:id')
  reviewSitePrep(@Param('id') id: string, @Body() dto: ReviewSitePrepDto) {
    return this.admin.reviewSitePrepItem(id, dto);
  }

  // 출근 관리(Field Pass P0) — 날짜 필터 조회
  @Get('attendances')
  attendances(@Query('date') date?: string, @Query('limit') limit?: string) {
    return this.admin.listAttendances(date, limit ? Number(limit) : 200);
  }

  // ── 리드 관리(BM 검증 CRM) ──
  @Get('leads')
  leads(@Query('stage') stage?: LeadStage, @Query('limit') limit?: string) {
    return this.admin.listLeads(stage, limit ? Number(limit) : 200);
  }

  @Post('leads')
  createLead(@Body() dto: CreateLeadDto) {
    return this.admin.createLead(dto);
  }

  @Patch('leads/:id')
  updateLead(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.admin.updateLead(id, dto);
  }

  @Post('interviews')
  createInterview(@Body() dto: CreateInterviewDto) {
    return this.admin.createInterview(dto);
  }

  @Patch('interviews/:id')
  updateInterview(@Param('id') id: string, @Body() dto: UpdateInterviewDto) {
    return this.admin.updateInterview(id, dto);
  }

  @Get('survey-responses')
  surveyResponses(@Query('limit') limit?: string) {
    return this.admin.listSurveyResponses(limit ? Number(limit) : 200);
  }

  @Post('survey-responses')
  createSurveyResponse(@Body() dto: CreateSurveyResponseDto) {
    return this.admin.createSurveyResponse(dto);
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

  // 행정·노무 파트너 연계 신청 목록 조회
  @Get('referrals')
  listReferrals() {
    return this.admin.listReferrals();
  }

  // 행정·노무 파트너 연계 신청 상태 변경
  @Patch('referrals/:id/status')
  setReferralStatus(
    @Param('id') id: string,
    @Body() body: { status: PartnerReferralStatus },
  ) {
    return this.admin.setReferralStatus(id, body.status);
  }
}
