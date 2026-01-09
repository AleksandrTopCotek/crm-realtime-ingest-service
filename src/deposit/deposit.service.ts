import { Injectable, Logger } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';
import { KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';

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
  addPaymentEventToDB(res: Response) {
    try {
      this.logger.log('Insider addPaymentEventToDB');
      this.logger.log(res);
    } catch (e) {
      this.logger.error(`Error- ${e}`);
    }
  }
  async findAll() {
    const events = await this.prisma.events.findMany();
    this.logger.log(events);
    return `This action returns all deposit`;
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
          this.addPaymentEventToDB(res);
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
