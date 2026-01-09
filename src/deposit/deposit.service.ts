import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';
import { KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class DepositService {
  logger = new Logger();
  constructor(
    private readonly prisma: PrismaService,
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly hcs: HandleConfigService,
    private readonly schemaService: SchemaService,
  ) {}

  private extractPaymentUuid(decoded: unknown): string | undefined {
    if (decoded && typeof decoded === 'object' && 'payment_uuid' in decoded) {
      const value = (decoded as { payment_uuid?: unknown }).payment_uuid;
      if (typeof value === 'string' && value.trim().length > 0) return value;
    }
    return undefined;
  }
  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    try {
      return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
    } catch {
      return {};
    }
  }
  async addPaymentEventToDB(paymentUuid: string, decoded: unknown, res: Response) {
    try {
      const responseBody = await res.text().catch(() => '');
      const payload: Prisma.InputJsonObject = {
        payment_uuid: paymentUuid,
        decoded: this.toJsonValue(decoded),
        worker: {
          url: res.url,
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          body: responseBody,
        },
      };
      await this.prisma.events.create({
        data: {
          event_id: paymentUuid,
          payload,
          status: res.ok ? 'review' : 'declined',
          reviewed_at: null,
        },
      });
    } catch (e: unknown) {
      this.logger.error(`Error in addPaymentEventToDB - ${String(e)}`);
    }
  }

  async retrieveApprovedPayments() {
    try {
      this.logger.log('retrieveApprovedPayments inside');
      return await this.prisma.events.findMany({ where: { status: { equals: 'approved' } } });
    } catch (e) {
      this.logger.log(e);
    }
  }
  async getAllPaymentsToCellExpert() {
    try {
      const payments = await this.prisma.$transaction(async (tx) => {
        this.logger.debug('getAllPaymentsToCellExpert transaction start');
        const approvedPayments = await this.retrieveApprovedPayments();
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
  async findAll() {
    try {
      const events = await this.prisma.events.findMany();
      return events;
    } catch (e) {
      this.logger.error(e);
    }
  }
  async getKafkaPayment(raw: Buffer<ArrayBufferLike>, context: KafkaContext) {
    try {
      if (raw.length >= 6 && raw.readUInt8(0) === 0) {
        try {
          const { decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
          const data = JSON.stringify(decoded);
          const url = this.hcs.workerEndpoint('/api/bonus');
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              body: data,
            }),
          });
          this.logger.debug(`getKafkaPayment response: ${res.status} ${res.statusText}`);
          const paymentUuid = this.extractPaymentUuid(decoded) ?? randomUUID();
          await this.addPaymentEventToDB(paymentUuid, decoded, res);
          return;
        } catch (e) {
          this.logger.error(`Failed to handle payment (schema-registry framed): ${String(e)}`);
          return;
        }
      }

      const schema = await this.schemaService.getSchema('payment');
      const decoded = schema.fromBuffer(raw);
    } catch (e) {
      this.logger.error(`Error- ${e}`);
    }
  }
}
