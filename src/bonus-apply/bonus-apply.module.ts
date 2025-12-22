import { Module } from '@nestjs/common';
import { BonusApplyService } from './bonus-apply.service';
import { BonusApplyController } from './bonus-apply.controller';

@Module({
  controllers: [BonusApplyController],
  providers: [BonusApplyService],
})
export class BonusApplyModule {}
