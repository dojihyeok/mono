import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  IndustryType,
  TeamAvailabilityStatus,
} from '@prisma/client';
import { TeamsService } from './teams.service';
import { RegisterTeamDto } from './dto/register-team.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

// 전역 프리픽스 없음 — 다른 컨트롤러와 동일 규약. id = 반장(leader)
@Controller()
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  // 팀 디렉터리(후보매칭/리더풀) — ?industry=&region=&workType=&availability=&limit=
  @Get('teams')
  listTeams(
    @Query('industry') industry?: string,
    @Query('region') region?: string,
    @Query('workType') workType?: string,
    @Query('availability') availability?: string,
    @Query('limit') limit?: string,
  ) {
    return this.teams.listTeams({
      industry: (industry as IndustryType) || undefined,
      region: region || undefined,
      workType: workType || undefined,
      availability: (availability as TeamAvailabilityStatus) || undefined,
      limit: limit ? Number(limit) : 50,
    });
  }

  // 반장: 내 팀 조회
  @Get('users/:id/team')
  getTeam(@Param('id') id: string) {
    return this.teams.getTeam(id);
  }

  // 반장: 팀 등록(멤버 일괄)
  @Post('users/:id/team')
  registerTeam(@Param('id') id: string, @Body() dto: RegisterTeamDto) {
    return this.teams.registerTeam(id, dto);
  }

  // 반장: 팀 삭제
  @Delete('users/:id/team')
  deleteTeam(@Param('id') id: string) {
    return this.teams.deleteTeam(id);
  }

  // 반장: 팀 가동일정 목록(weekStart 순)
  @Get('users/:id/team/availability')
  getAvailability(@Param('id') id: string) {
    return this.teams.getTeamAvailability(id);
  }

  // 반장: 팀 가동일정 주간 upsert
  @Put('users/:id/team/availability')
  upsertAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.teams.upsertTeamAvailability(id, dto);
  }
}
