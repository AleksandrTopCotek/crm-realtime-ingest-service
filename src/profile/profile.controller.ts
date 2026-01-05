import { Controller, Logger } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';

const PROFILE_TOPIC = process.env.KF_EXT_PROFILE_TOPIC_NAME ?? '';

@Controller('Profile')
export class ProfileController {
  logger = new Logger();
  constructor(
    private readonly profileService: ProfileService,
    private readonly schemaService: SchemaService,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  @MessagePattern(PROFILE_TOPIC)
  async handlePayment(@Payload() _message: unknown, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage() as unknown as { value: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;

    if (raw.length >= 6 && raw.readUInt8(0) === 0) {
      const { schemaId, decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
      this.logger.log(`Received profile (schemaId=${schemaId})`);
      this.logger.debug(JSON.stringify(decoded));
      this.logger.log(`topic, ${context.getTopic()}`);
      return;
    }

    const schema = await this.schemaService.getSchema('profile');
    const decoded = schema.fromBuffer(raw);

    this.logger.log('Received profile (local schema)');
    this.logger.debug(JSON.stringify(decoded));
    this.logger.log(`topic, ${context.getTopic()}`);
  }
}
