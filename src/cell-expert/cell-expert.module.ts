import { Module } from '@nestjs/common';
import { CellExpertService } from './cell-expert.service';
import { DepositModule } from 'src/deposit/deposit.module';
import { DepositService } from 'src/deposit/deposit.service';
import { CellExpertController } from './cell-expert.controller';

@Module({
  providers: [CellExpertService, DepositService],
  imports: [DepositModule],
  exports: [CellExpertService],
  controllers: [CellExpertController],
})
export class CellExpertModule {}
