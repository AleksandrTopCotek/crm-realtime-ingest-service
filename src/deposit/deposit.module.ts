import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryModule } from 'src/shared/services/schema-registry/schema-registry.module';

@Module({
  imports: [SchemaRegistryModule],
  controllers: [DepositController],
  providers: [DepositService, SchemaService],
})
export class DepositModule {}
