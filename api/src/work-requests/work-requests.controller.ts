import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WorkRequestsService } from './work-requests.service';
import { CreateWorkRequestDto } from './dto/create-work-request.dto';
import { UpdateWorkRequestDto } from './dto/update-work-request.dto';
import { QueryWorkRequestDto } from './dto/query-work-request.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

// 전역 프리픽스 없음 — 절대경로 명시. 현장작업요청(WorkRequest) 도메인.
@Controller()
export class WorkRequestsController {
  constructor(private readonly workRequests: WorkRequestsService) {}

  // 작업요청 생성(기본 DRAFT)
  @Post('work-requests')
  create(@Body() dto: CreateWorkRequestDto) {
    return this.workRequests.create(dto);
  }

  // 목록(필터) — 정적 경로이므로 :id 보다 위에 둠
  @Get('work-requests')
  list(@Query() query: QueryWorkRequestDto) {
    return this.workRequests.list(query);
  }

  // 단건
  @Get('work-requests/:id')
  getOne(@Param('id') id: string) {
    return this.workRequests.getOne(id);
  }

  // 수정 / 상태 전이
  @Patch('work-requests/:id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkRequestDto) {
    return this.workRequests.update(id, dto);
  }

  // 특정 사용자가 작성한 작업요청 목록
  @Get('users/:id/work-requests')
  listByRequester(@Param('id') id: string) {
    return this.workRequests.listByRequester(id);
  }

  // 요청 후보 목록
  @Get('work-requests/:id/candidates')
  listCandidates(@Param('id') id: string) {
    return this.workRequests.listCandidates(id);
  }

  // 자동 후보추천(매칭 점수) — 정적 세그먼트, :id 동적보다 위.
  @Get('work-requests/:id/recommendations')
  recommend(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.workRequests.recommend(id, limit ? Number(limit) : 10);
  }

  // 후보 지정(멱등)
  @Post('work-requests/:id/candidates')
  addCandidate(@Param('id') id: string, @Body() dto: CreateCandidateDto) {
    return this.workRequests.addCandidate(id, dto);
  }

  // 자동 후보추천 (Sprint 4)
  @Post('work-requests/:id/auto-recommend')
  autoRecommend(@Param('id') id: string) {
    return this.workRequests.autoRecommendCandidates(id);
  }

  // 후보 상태/점수/메모 변경
  @Patch('work-requests/:id/candidates/:cid')
  updateCandidate(
    @Param('id') id: string,
    @Param('cid') cid: string,
    @Body() dto: UpdateCandidateDto,
  ) {
    return this.workRequests.updateCandidate(id, cid, dto);
  }
}
