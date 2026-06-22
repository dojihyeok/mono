import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BasicProfileDto } from './dto/basic-profile.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateCareerCardDto } from './dto/create-career-card.dto';
import { CreateEducationDto } from './dto/create-education.dto';
import { RegisterInterestDto } from './dto/register-interest.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // 가입: 이름 + (휴대폰 또는 이메일)
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.users.signup(dto);
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
}
