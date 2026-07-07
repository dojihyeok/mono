import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AdminModule } from './admin/admin.module';
import { CompaniesModule } from './companies/companies.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ApplicationsModule } from './applications/applications.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CoworkersModule } from './coworkers/coworkers.module';
import { TeamsModule } from './teams/teams.module';
import { WorkRequestsModule } from './work-requests/work-requests.module';
import { FieldOpsModule } from './field-ops/field-ops.module';
import { ReviewsModule } from './reviews/reviews.module';
// 외국인 기술인력 관리 (dev-plan-foreign-workforce)
import { GlossaryModule } from './glossary/glossary.module';
import { SettlementsModule } from './settlements/settlements.module';
import { TrainingModule } from './training/training.module';
import { ReferralsModule } from './referrals/referrals.module';
import { RiskModule } from './risk/risk.module';
import { CommunityModule } from './community/community.module';

@Controller()
class HealthController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    EventsModule,
    AdminModule,
    CompaniesModule,
    AnalyticsModule,
    ApplicationsModule,
    NotificationsModule,
    CoworkersModule,
    TeamsModule,
    WorkRequestsModule,
    FieldOpsModule,
    ReviewsModule,
    GlossaryModule,
    SettlementsModule,
    TrainingModule,
    ReferralsModule,
    RiskModule,
    CommunityModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
