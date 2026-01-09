import { Injectable, Logger } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';

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
  create(_createDepositDto: CreateDepositDto) {
    void _createDepositDto;
    return 'This action adds a new deposit';
  }
  private extractPaymentUuid(decoded: unknown): string | undefined {
    if (decoded && typeof decoded === 'object' && 'payment_uuid' in decoded) {
      const value = (decoded as { payment_uuid?: unknown }).payment_uuid;
      if (typeof value === 'string' && value.trim().length > 0) return value;
    }
    return undefined;
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    // Prisma JSON columns expect a JSON-serializable value.
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
          status: res.ok ? 'processed' : 'failed',
          processed_at: res.ok ? new Date() : null,
        },
      });
    } catch (e: unknown) {
      this.logger.error(`Error in addPaymentEventToDB - ${String(e)}`);
    }
  }
  async findAll() {
    const events = await this.prisma.events.findMany();
    this.logger.log(events);
    return events;
  }
  async getKafkaPayment(raw: Buffer<ArrayBufferLike>, context: KafkaContext) {
    try {
      if (raw.length >= 6 && raw.readUInt8(0) === 0) {
        try {
          const { schemaId, decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
          this.logger.log(`Received payment (schemaId=${schemaId})`);

          this.logger.debug(JSON.stringify(decoded));
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

      // Fallback to local .avsc (non-framed Avro)
      const schema = await this.schemaService.getSchema('payment');
      const decoded = schema.fromBuffer(raw);
      this.logger.log('Received payment (local schema)');
      this.logger.debug(JSON.stringify(decoded));
      this.logger.log(`topic, ${context.getTopic()}`);
    } catch (e) {
      this.logger.error(`Error- ${e}`);
    }
  }
}
