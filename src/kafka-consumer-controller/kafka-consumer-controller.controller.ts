import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

const TOPIC_SPORT_ROUND = process.env.KF_SPORT_ROUND_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_tagged_sport_round_data';
const TOPIC_PROFILE_VERIFICATION_STATE =
  process.env.KF_PROFILE_VERIFICATION_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_profile_verification_state';
const TOPIC_BONUS_GAME = process.env.KF_BONUS_GAME_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_converted_bonus_game';

@Controller()
export class KafkaConsumerController {
  logger = new Logger();
  // no DI needed yet
  @MessagePattern(TOPIC_SPORT_ROUND)
  handleSportRound(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const bytes = kafkaMessage.value?.length ?? 0;

    if (bytes > 0) {
      const raw = kafkaMessage.value;
      if (!raw) return;

      const text = raw.toString('utf8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = JSON.parse(text);

      this.logger.log(data);
    }
    this.logger.log(`Sport round topic '${ctx.getTopic()}', bytes=${bytes}`);
  }

  @MessagePattern(TOPIC_PROFILE_VERIFICATION_STATE)
  handleProfileVerification(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const bytes = kafkaMessage.value?.length ?? 0;

    if (bytes > 0) {
      const raw = kafkaMessage.value;
      if (!raw) return;

      const text = raw.toString('utf8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = JSON.parse(text);

      this.logger.log(data);
    }
    this.logger.log(`Profile verification state topic '${ctx.getTopic()}', bytes=${bytes}`);
  }

  @MessagePattern(TOPIC_BONUS_GAME)
  handleBonusGame(@Payload() _message: unknown, @Ctx() ctx: KafkaContext) {
    const kafkaMessage = ctx.getMessage() as unknown as { value?: Buffer };
    const bytes = kafkaMessage.value?.length ?? 0;
    if (bytes > 0) {
      const raw = kafkaMessage.value;
      if (!raw) return;

      const text = raw.toString('utf8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = JSON.parse(text);

      this.logger.log(data);
    }

    this.logger.log(`Prod converted bonus game topic '${ctx.getTopic()}', bytes=${bytes}`);
  }
}
