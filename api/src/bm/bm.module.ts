import { Module } from '@nestjs/common';
import { BmController } from './bm.controller';
import { BmService } from './bm.service';

@Module({
  controllers: [BmController],
  providers: [BmService],
})
export class BmModule {}
