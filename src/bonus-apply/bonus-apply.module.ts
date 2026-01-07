import { Module } from '@nestjs/common';
import { BonusApplyService } from './bonus-apply.service';
import { BonusApplyController } from './bonus-apply.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';

@Module({
  controllers: [BonusApplyController],
  imports: [HandleConfigModule],
  providers: [BonusApplyService, SchemaService],
})
export class BonusApplyModule {}
