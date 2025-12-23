import { Module } from '@nestjs/common';
import { BonusApplyService } from './bonus-apply.service';
import { BonusApplyController } from './bonus-apply.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Module({
  controllers: [BonusApplyController],
  providers: [BonusApplyService, SchemaService],
})
export class BonusApplyModule {}
