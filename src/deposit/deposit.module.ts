import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Module({
  controllers: [DepositController],
  providers: [DepositService, SchemaService],
})
export class DepositModule {}
