import { Controller, Logger } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Controller('deposit')
export class DepositController {
  logger = new Logger();
  constructor(
    private readonly depositService: DepositService,
    private readonly schemaService: SchemaService,
  ) {}
  @MessagePattern('payment-topic')
  async handlePayment(@Payload() _message: unknown, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage() as unknown as { value: Buffer };
    const raw = kafkaMessage.value;
    const schema = await this.schemaService.getSchema('payment');
    const decoded = schema.fromBuffer(raw);
    this.logger.log('Received payment:', decoded);
    this.logger.log(`topic, ${context.getTopic()}`);
  }
}
