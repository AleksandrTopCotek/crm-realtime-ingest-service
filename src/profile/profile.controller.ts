import { Controller, Logger } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';

const PROFILE_TOPIC = process.env.KF_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_ext_profile';

@Controller('Profile')
export class ProfileController {
  logger = new Logger();
  constructor(
    private readonly profileService: ProfileService,
    private readonly schemaService: SchemaService,
  ) {}

  @MessagePattern(PROFILE_TOPIC)
  async handlePayment(@Payload() _message: unknown, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage() as unknown as { value: Buffer };
    const raw = kafkaMessage.value;
    const schema = await this.schemaService.getSchema('profile');
    const decoded = schema.fromBuffer(raw);

    this.logger.log('Received profile:', decoded);
    this.logger.log(`topic, ${context.getTopic()}`);
  }
}
