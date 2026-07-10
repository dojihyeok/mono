import { Module } from '@nestjs/common';
import { AmonoController } from './amono.controller';
import { AmonoService } from './amono.service';

@Module({
  controllers: [AmonoController],
  providers: [AmonoService],
})
export class AmonoModule {}
