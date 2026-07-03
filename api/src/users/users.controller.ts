import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { BasicProfileDto } from './dto/basic-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateCareerCardDto } from './dto/create-career-card.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { RegisterInterestDto } from './dto/register-interest.dto';
import { FieldLeaderProfileDto } from './dto/field-leader-profile.dto';
import { WorkerProfileDto } from './dto/worker-profile.dto';
import { OperatorProfileDto } from './dto/operator-profile.dto';
import { CreateEquipmentHistoryDto } from './dto/create-equipment-history.dto';
import { VisaStatusDto } from './dto/visa-status.dto';
import { DocumentRecordDto } from './dto/document-record.dto';
import { UpdateConsultRequestDto } from './dto/update-consult-request.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // 가입: 이름 + (휴대폰 또는 이메일)
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.users.signup(dto);
  }

  // 본인 프로필(역할 포함) — 권한 게이트용
  @Get('users/:id')
  getMe(@Param('id') id: string) {
    return this.users.getMe(id);
  }

  // 반장 승인 요청(기능공 → 대기)
  @Post('users/:id/foreman-request')
  requestForeman(@Param('id') id: string) {
    return this.users.requestForeman(id);
  }

  // 현장리더 승인 요청 — foreman-request 의 alias(동일 동작). 기존 라우트는 유지.
  @Post('users/:id/field-leader-request')
  requestFieldLeader(@Param('id') id: string) {
    return this.users.requestForeman(id);
  }

  // 현장리더 프로필 upsert (FieldLeaderProfile, userId @unique)
  @Put('users/:id/field-leader-profile')
  upsertFieldLeaderProfile(
    @Param('id') id: string,
    @Body() dto: FieldLeaderProfileDto,
  ) {
    return this.users.upsertFieldLeaderProfile(id, dto);
  }

  // 현장리더 프로필 조회 (없으면 null)
  @Get('users/:id/field-leader-profile')
  getFieldLeaderProfile(@Param('id') id: string) {
    return this.users.getFieldLeaderProfile(id);
  }

  // 기술자 확장 프로필 upsert/조회 (WorkerProfile, userId @unique)
  @Put('users/:id/worker-profile')
  upsertWorkerProfile(@Param('id') id: string, @Body() dto: WorkerProfileDto) {
    return this.users.upsertWorkerProfile(id, dto);
  }

  @Get('users/:id/worker-profile')
  getWorkerProfile(@Param('id') id: string) {
    return this.users.getWorkerProfile(id);
  }

  // 운영자 프로필 upsert/조회 (ProjectOperator, userId @unique)
  @Put('users/:id/operator-profile')
  upsertOperatorProfile(@Param('id') id: string, @Body() dto: OperatorProfileDto) {
    return this.users.upsertOperatorProfile(id, dto);
  }

  @Get('users/:id/operator-profile')
  getOperatorProfile(@Param('id') id: string) {
    return this.users.getOperatorProfile(id);
  }

  // 장비 이력 등록/조회/삭제 (EquipmentHistory)
  @Post('users/:id/equipment-history')
  addEquipmentHistory(
    @Param('id') id: string,
    @Body() dto: CreateEquipmentHistoryDto,
  ) {
    return this.users.addEquipmentHistory(id, dto);
  }

  @Get('users/:id/equipment-history')
  listEquipmentHistory(@Param('id') id: string) {
    return this.users.listEquipmentHistory(id);
  }

  @Delete('users/:id/equipment-history/:eid')
  deleteEquipmentHistory(@Param('id') id: string, @Param('eid') eid: string) {
    return this.users.deleteEquipmentHistory(id, eid);
  }

  // ── 외국인 체류·비자·서류 (dev-plan-foreign-workforce §6) ──
  // 비자 상태 등록(이력) / 목록([0]=현재 비자)
  @Post('users/:id/visa')
  createVisa(@Param('id') id: string, @Body() dto: VisaStatusDto) {
    return this.users.createVisa(id, dto);
  }

  @Get('users/:id/visa')
  listVisa(@Param('id') id: string) {
    return this.users.listVisa(id);
  }

  // 서류 업로드 / 목록
  @Post('users/:id/documents')
  addDocument(@Param('id') id: string, @Body() dto: DocumentRecordDto) {
    return this.users.addDocument(id, dto);
  }

  @Get('users/:id/documents')
  listDocuments(@Param('id') id: string) {
    return this.users.listDocuments(id);
  }

  // 회원 탈퇴 (User 삭제 — 연관 데이터 cascade)
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.users.deleteUser(id);
  }

  // 기본 프로필: 직종 + 경력연차 + 희망지역
  @Patch('users/:id/basic-profile')
  setBasicProfile(@Param('id') id: string, @Body() dto: BasicProfileDto) {
    return this.users.setBasicProfile(id, dto);
  }

  // 자격증 등록 (DB 저장, FK userId)
  @Post('users/:id/certificates')
  addCertificate(@Param('id') id: string, @Body() dto: CreateCertificateDto) {
    return this.users.addCertificate(id, dto);
  }

  // 경력 카드 등록 (DB 저장, FK userId)
  @Post('users/:id/careers')
  addCareerCard(@Param('id') id: string, @Body() dto: CreateCareerCardDto) {
    return this.users.addCareerCard(id, dto);
  }

  // 교육 이력 등록 (DB 저장, FK userId)
  @Post('users/:id/educations')
  addEducation(@Param('id') id: string, @Body() dto: CreateEducationDto) {
    return this.users.addEducation(id, dto);
  }

  // 관심 기능 등록 (DB 저장, FK userId)
  @Post('users/:id/interests')
  registerInterest(@Param('id') id: string, @Body() dto: RegisterInterestDto) {
    return this.users.registerInterest(id, dto);
  }

  // 공개 프로필 조회 (공유 링크 /p/:id 용 — 민감정보 제외)
  @Get('users/:id/public')
  getPublicProfile(@Param('id') id: string) {
    return this.users.getPublicProfile(id);
  }

  // ── 공고 저장 (SavedJob) ──
  @Post('users/:id/saved-jobs')
  addSavedJob(@Param('id') id: string, @Body('jobPostId') jobPostId: string) {
    return this.users.addSavedJob(id, jobPostId);
  }

  @Delete('users/:id/saved-jobs/:jobId')
  removeSavedJob(@Param('id') id: string, @Param('jobId') jobPostId: string) {
    return this.users.removeSavedJob(id, jobPostId);
  }

  @Get('users/:id/saved-jobs')
  listSavedJobs(@Param('id') id: string) {
    return this.users.listSavedJobs(id);
  }

  // ── 면접/상담 요청 (ConsultRequest) 확인 및 응답 ──
  @Get('users/:id/consult-requests')
  listConsultRequests(@Param('id') id: string) {
    return this.users.listConsultRequests(id);
  }

  @Patch('users/:id/consult-requests/:reqId')
  updateConsultRequest(
    @Param('id') id: string,
    @Param('reqId') reqId: string,
    @Body() dto: UpdateConsultRequestDto,
  ) {
    return this.users.updateConsultRequest(id, reqId, dto);
  }

  // ── 현장 운영: 체크인 (FieldCheckin) ──
  @Post('users/:id/checkins')
  addCheckin(
    @Param('id') id: string,
    @Body() body: { type: import('@prisma/client').CheckinType; workDate: string; memo?: string },
  ) {
    return this.users.addCheckin(id, body);
  }

  @Get('users/:id/checkins')
  listCheckins(
    @Param('id') id: string,
    @Query('workDate') workDate?: string,
  ) {
    return this.users.listCheckins(id, workDate);
  }
}
