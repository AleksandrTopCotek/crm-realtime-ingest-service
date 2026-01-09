import { Module } from '@nestjs/common';
import { CellExpertService } from './cell-expert.service';
import { DepositModule } from 'src/deposit/deposit.module';
import { CellExpertController } from './cell-expert.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [CellExpertService],
  imports: [DepositModule, PrismaModule],
  exports: [CellExpertService],
  controllers: [CellExpertController],
})
export class CellExpertModule {}
