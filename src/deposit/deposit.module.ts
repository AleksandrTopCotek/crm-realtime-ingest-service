import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryModule } from 'src/shared/services/schema-registry/schema-registry.module';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CellExpertModule } from 'src/cell-expert/cell-expert.module';

@Module({
  imports: [SchemaRegistryModule, HandleConfigModule, PrismaModule, CellExpertModule],
  controllers: [DepositController],
  providers: [DepositService, SchemaService],
})
export class DepositModule {}
