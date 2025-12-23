import { Module } from '@nestjs/common';
import { BonusCreditService } from './bonus-credit.service';
import { BonusCreditController } from './bonus-credit.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Module({
  controllers: [BonusCreditController],
  providers: [BonusCreditService, SchemaService],
})
export class BonusCreditModule {}
