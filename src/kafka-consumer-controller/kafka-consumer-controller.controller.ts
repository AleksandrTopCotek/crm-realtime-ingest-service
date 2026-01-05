import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

const TOPIC_SPORT_ROUND =
  process.env.KF_SPORT_ROUND_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_tagged_sport_round_data';
const TOPIC_PROFILE_VERIFICATION_STATE =
  process.env.KF_PROFILE_VERIFICATION_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_profile_verification_state';
const TOPIC_BONUS_GAME =
  process.env.KF_BONUS_GAME_TOPIC_NAME ?? 'vegasnova_hrzn05_prod_converted_bonus_game';

@Controller()
export class KafkaConsumerController {
  logger = new Logger();
  // no DI needed yet
  @EventPattern(TOPIC_SPORT_ROUND)
  handleSportRound(@Payload() message: any, @Ctx() ctx: KafkaContext) {
    this.logger.log(`Sport round topick, ${message?.value}`);
  }

  @EventPattern(TOPIC_PROFILE_VERIFICATION_STATE)
  handleProfileVerification(@Payload() message: any) {
    this.logger.log(`Profile verification state topick, ${message?.value}`);
  }

  @EventPattern(TOPIC_BONUS_GAME)
  handleBonusGame(@Payload() message: any) {
    this.logger.log(`Prod converted bonus game topick, ${message?.value}`);
  }
}
