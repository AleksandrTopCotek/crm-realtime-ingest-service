import { Controller, Logger } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

const PAYMENT_TOPIC = process.env.KF_PAYMENT_TOPIC_NAME ?? '';

@Controller('deposit')
export class DepositController {
  logger = new Logger();
  constructor(
    private readonly depositService: DepositService,
    private readonly schemaService: SchemaService,
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly hcs: HandleConfigService,
  ) {}
  @MessagePattern(PAYMENT_TOPIC)
  async handlePayment(@Payload() _message: unknown, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage() as unknown as { value: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;

    // If producer uses Confluent framing, decode via Schema Registry.
    if (raw.length >= 6 && raw.readUInt8(0) === 0) {
      const { schemaId, decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
      this.logger.log(`Received payment (schemaId=${schemaId})`);

      this.logger.debug(JSON.stringify(decoded));
      const data = JSON.stringify(decoded);
      return await fetch(this.hcs.envWorkerUrl + 'api/bonus', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          body: data,
        }),
      }).then((req) => this.logger.debug(req));
    }

    // Fallback to local .avsc (non-framed Avro)
    const schema = await this.schemaService.getSchema('payment');
    const decoded = schema.fromBuffer(raw);
    this.logger.log('Received payment (local schema)');
    this.logger.debug(JSON.stringify(decoded));
    this.logger.log(`topic, ${context.getTopic()}`);
  }
}
