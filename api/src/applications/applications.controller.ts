import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplyDto } from './dto/apply.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { CheckInDto } from './dto/check-in.dto';

@Controller()
export class ApplicationsController {
  constructor(private readonly apps: ApplicationsService) {}

  // 기술자: 공고 지원
  @Post('job-posts/:jobPostId/apply')
  apply(@Param('jobPostId') jobPostId: string, @Body() dto: ApplyDto) {
    return this.apps.apply(jobPostId, dto);
  }

  // 기술자: 내 지원 목록 / 배정 목록(+출역)
  @Get('users/:userId/applications')
  userApplications(@Param('userId') userId: string) {
    return this.apps.listUserApplications(userId);
  }

  @Get('users/:userId/assignments')
  userAssignments(@Param('userId') userId: string) {
    return this.apps.listUserAssignments(userId);
  }

  // 기업: 우리 공고 지원자 목록
  @Get('companies/:companyId/applications')
  companyApplications(@Param('companyId') companyId: string) {
    return this.apps.listCompanyApplications(companyId);
  }

  // 기업: 수락/반려
  @Patch('applications/:id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetStatusDto) {
    return this.apps.setStatus(id, dto);
  }

  // 기술자: 출근/퇴근 체크
  @Post('applications/:id/checkin')
  checkIn(@Param('id') id: string, @Body() dto: CheckInDto) {
    return this.apps.checkIn(id, dto);
  }

  @Post('applications/:id/checkout')
  checkOut(@Param('id') id: string) {
    return this.apps.checkOut(id);
  }

  // 기업/반장: 익일 재출역 제안
  @Post('job-posts/:jobPostId/propose-re-attendance')
  proposeReAttendance(
    @Param('jobPostId') jobPostId: string,
    @Body() dto: { userIds: string[]; workDate: string }
  ) {
    return this.apps.proposeReAttendance(jobPostId, dto.userIds, dto.workDate);
  }
}
