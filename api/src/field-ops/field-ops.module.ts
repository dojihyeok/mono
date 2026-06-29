import { Module } from '@nestjs/common';
import { FieldOpsController } from './field-ops.controller';
import { FieldOpsService } from './field-ops.service';

// Field Ops 관심 도메인. PrismaModule(@Global) 사용 → import 불필요.
@Module({
  controllers: [FieldOpsController],
  providers: [FieldOpsService],
  exports: [FieldOpsService],
})
export class FieldOpsModule {}
