import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IndustryType,
  KoreanLevel,
  Residency,
  VisaType,
} from '@prisma/client';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyLoginDto } from './dto/company-login.dto';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { SaveWorkerDto } from './dto/save-worker.dto';
import { CreateWorkRecordDto } from './dto/create-work-record.dto';
import { CreateConsultRequestDto } from './dto/create-consult-request.dto';

// 기업용 웹 BFF(/api/companies/*, /api/workers) → 이 컨트롤러.
@Controller()
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  // 기업 신청/등록
  @Post('companies')
  create(@Body() dto: CreateCompanyDto) {
    return this.companies.createCompany(dto);
  }

  // 기업 로그인(연락처로 기존 협약 조회) — /companies/:id 보다 먼저 매칭되도록 위에 둠
  @Post('companies/login')
  login(@Body() dto: CompanyLoginDto) {
    return this.companies.loginByPhone(dto.contactPhone);
  }

  // 수행기업 디렉터리(후보조회) — ?industry=&region=&limit=. /companies/:id 와 무관한 별도 경로.
  @Get('performers')
  listPerformers(
    @Query('industry') industry?: string,
    @Query('region') region?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companies.listPerformers({
      industry: (industry as IndustryType) || undefined,
      region: region || undefined,
      limit: limit ? Number(limit) : 50,
    });
  }

  // 외국인 기술자 후보 검색 (§5-5) — 정적 라우트
  @Get('foreign-workers')
  browseForeignWorkers(
    @Query('koreanLevel') koreanLevel?: string,
    @Query('residency') residency?: string,
    @Query('visaType') visaType?: string,
    @Query('industry') industry?: string,
    @Query('region') region?: string,
    @Query('interpreterNeeded') interpreterNeeded?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companies.browseForeignWorkers({
      koreanLevel: (koreanLevel as KoreanLevel) || undefined,
      residency: (residency as Residency) || undefined,
      visaType: (visaType as VisaType) || undefined,
      industry: (industry as IndustryType) || undefined,
      region: region || undefined,
      interpreterNeeded: interpreterNeeded === 'true' ? true : interpreterNeeded === 'false' ? false : undefined,
      limit: limit ? Number(limit) : 50,
    });
  }

  // 수행기업 공개 프로필 — /companies/:id 보다 먼저 매칭되도록 위에 둠
  @Get('companies/:id/profile')
  getProfile(@Param('id') id: string) {
    return this.companies.getCompanyProfile(id);
  }

  @Get('companies/:id')
  get(@Param('id') id: string) {
    return this.companies.getCompany(id);
  }

  // 기업 정보 수정 — 신뢰 프로필(파트너 유형·산업분야·안전이수율·재의뢰율 등)
  @Patch('companies/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companies.updateCompany(id, dto);
  }

  // 작업수행사례 등록/조회/삭제 (WorkRecord)
  @Post('companies/:id/work-records')
  createWorkRecord(@Param('id') id: string, @Body() dto: CreateWorkRecordDto) {
    return this.companies.createWorkRecord(id, dto);
  }

  @Get('companies/:id/work-records')
  listWorkRecords(@Param('id') id: string) {
    return this.companies.listWorkRecords(id);
  }

  @Delete('companies/:id/work-records/:rid')
  deleteWorkRecord(@Param('id') id: string, @Param('rid') rid: string) {
    return this.companies.deleteWorkRecord(id, rid);
  }

  // 채용 공고 선등록
  @Post('companies/:id/job-posts')
  createJobPost(@Param('id') id: string, @Body() dto: CreateJobPostDto) {
    return this.companies.createJobPost(id, dto);
  }

  @Get('companies/:id/job-posts')
  listJobPosts(@Param('id') id: string) {
    return this.companies.listJobPosts(id);
  }

  @Delete('companies/:id/job-posts/:postId')
  deleteJobPost(@Param('id') id: string, @Param('postId') postId: string) {
    return this.companies.deleteJobPost(id, postId);
  }

  // 관심 기술자 저장 / 해제 / 목록
  @Post('companies/:id/saved')
  save(@Param('id') id: string, @Body() dto: SaveWorkerDto) {
    return this.companies.saveWorker(id, dto);
  }

  @Delete('companies/:id/saved/:userId')
  unsave(@Param('id') id: string, @Param('userId') userId: string) {
    return this.companies.unsaveWorker(id, userId);
  }

  @Get('companies/:id/saved')
  listSaved(@Param('id') id: string) {
    return this.companies.listSaved(id);
  }

  // 기술자용 채용 공고 조회 — ?jobType=&region=&limit=
  @Get('job-posts')
  browseJobPosts(
    @Query('jobType') jobType?: string,
    @Query('region') region?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companies.browseJobPosts({
      jobType: jobType || undefined,
      region: region || undefined,
      limit: limit ? Number(limit) : 50,
    });
  }

  // 샘플 기술자 프로필 조회(공개 화이트리스트) — ?jobType=&region=&limit=
  @Get('workers')
  browse(
    @Query('jobType') jobType?: string,
    @Query('region') region?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companies.browseWorkers({
      jobType: jobType || undefined,
      region: region || undefined,
      limit: limit ? Number(limit) : 50,
    });
  }

  // ── 면접/상담 요청 (ConsultRequest) ──
  @Post('companies/:id/consult-requests')
  createConsultRequest(
    @Param('id') companyId: string,
    @Body() dto: CreateConsultRequestDto,
  ) {
    return this.companies.createConsultRequest(companyId, dto);
  }

  @Get('companies/:id/consult-requests')
  listConsultRequestsByCompany(@Param('id') companyId: string) {
    return this.companies.listConsultRequestsByCompany(companyId);
  }
}
