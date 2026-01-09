import { Controller, Get, Logger } from '@nestjs/common';
import { CellExpertService } from './cell-expert.service';

@Controller('cell-expert')
export class CellExpertController {
  logger = new Logger();
  constructor(private readonly cellExpertService: CellExpertService) {}
  @Get('payments')
  getAllPaymentsToCellExpert() {
    try {
      return this.cellExpertService.getAllPaymentsToCellExpert();
    } catch (e: unknown) {
      this.logger.error(e);
    }
  }
}
