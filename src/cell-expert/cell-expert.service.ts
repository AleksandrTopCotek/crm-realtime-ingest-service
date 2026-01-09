import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { DepositService } from 'src/deposit/deposit.service';

@Injectable()
export class CellExpertService {
  logger = new Logger();
  constructor(
    private readonly prisma: PrismaService,
    private readonly depositService: DepositService,
  ) {}
  async getAllPaymentsToCellExpert() {
    try {
      const payments = await this.prisma.$transaction(async (tx) => {
        this.logger.debug('getAllPaymentsToCellExpert transaction start');
        const approvedPayments = await this.depositService.retrieveApprovedPayments();
        this.logger.debug(`approvedPayments len ${approvedPayments?.length}`);
        const now = new Date();
        if (approvedPayments) {
          this.logger.debug(`inside if approvedPayments`);
          return await tx.events_in_cellexpert.createManyAndReturn({
            data: approvedPayments.map((p) => ({
              event_id: p.event_id,
              status: p.status ?? 'review',
              payload: p.payload === null ? undefined : (p.payload as Prisma.InputJsonValue),
              created_at: p.created_at ?? now,
              reviewed_at: p.reviewed_at ?? undefined,
              sent_to_cellexpert_at: now,
            })),
          });
        }
      });
      return payments ?? [];
    } catch (e) {
      this.logger.error(e);
    }
  }
}
