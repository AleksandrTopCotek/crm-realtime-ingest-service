import { Module } from '@nestjs/common';
import { BonusCreditService } from './bonus-credit.service';
import { BonusCreditController } from './bonus-credit.controller';

@Module({
  controllers: [BonusCreditController],
  providers: [BonusCreditService],
})
export class BonusCreditModule {}
