import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';

const TOPIC_SPORT_ROUND = process.env.KF_SPORT_ROUND_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_tagged_sport_round_data';
const TOPIC_PROFILE_VERIFICATION_STATE =
  process.env.KF_PROFILE_VERIFICATION_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_profile_verification_state';
const TOPIC_BONUS_GAME = process.env.KF_BONUS_GAME_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_converted_bonus_game';

@Controller()
export class KafkaConsumerController {
  logger = new Logger();

  constructor(
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly hcs: HandleConfigService,
  ) {}

  @MessagePattern(TOPIC_SPORT_ROUND)
  async handleSportRound(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;
    const bytes = raw.length;

    try {
      const { schemaId, decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
      this.logger.log(`Sport round '${ctx.getTopic()}', schemaId=${schemaId}, bytes=${bytes}`);
      this.logger.debug(JSON.stringify(decoded));
    } catch {
      this.logger.log(`Sport round '${ctx.getTopic()}', bytes=${bytes}`);
    }
  }

  @MessagePattern(TOPIC_PROFILE_VERIFICATION_STATE)
  async handleProfileVerification(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;
    const bytes = raw.length;

    try {
      const { schemaId, decoded } = await this.schemaRegistry.decodeConfluentAvro(raw);
      this.logger.log(`Profile verification '${ctx.getTopic()}', schemaId=${schemaId}, bytes=${bytes}`);
      this.logger.debug(JSON.stringify(decoded));
    } catch {
      this.logger.log(`Profile verification '${ctx.getTopic()}', bytes=${bytes}`);
    }
  }

  @MessagePattern(TOPIC_BONUS_GAME)
  async handleBonusGame(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const raw = kafkaMessage.value;
    if (!raw) return;
    const bytes = raw.length;

    const magic = raw.readUInt8(0);
    const schemaId = magic === 0 && raw.length >= 6 ? raw.readUInt32BE(1) : null;

    this.logger.log(
      `Prod converted bonus game topic '${ctx.getTopic()}', bytes=${bytes}, schemaId=${schemaId ?? 'n/a'}`,
    );

    if (magic !== 0) return;
    try {
      const decoded = await this.schemaRegistry.decodeConfluentAvro(raw);
      this.logger.debug(JSON.stringify(decoded.decoded));
    } catch (e) {
      this.logger.error(`Failed to decode bonus_game (schemaId=${schemaId ?? 'n/a'}): ${String(e)}`);
    }
  }
}
