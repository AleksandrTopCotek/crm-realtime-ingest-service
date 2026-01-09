import { Controller, Get, Logger } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

const PAYMENT_TOPIC = process.env.KF_PAYMENT_TOPIC_NAME ?? '';

@Controller('deposit')
export class DepositController {
  logger = new Logger();
  constructor(
    private readonly depositService: DepositService,
    private readonly hcs: HandleConfigService,
  ) {}
  @MessagePattern(PAYMENT_TOPIC)
  async handlePayment(@Payload() _message: unknown, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage() as unknown as { value: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;
    return this.depositService.getKafkaPayment(raw, context);
  }
  @Get()
  findAll() {
    try {
      return this.depositService.findAll();
    } catch (e: unknown) {
      this.logger.error(e);
    }
  }
}
