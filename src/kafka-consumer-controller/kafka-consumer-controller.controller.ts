import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

@Controller()
export class KafkaConsumerController {
  logger = new Logger();
  constructor(private readonly handleConfigService: HandleConfigService) {}
  @EventPattern('vegasnova_hrzn05_prod_tagged_sport_round_data')
  handleSportRound(@Payload() message: any, @Ctx() ctx: KafkaContext) {
    this.logger.log(`Sport round topick, ${message?.value}`);
  }

  @EventPattern('vegasnova_hrzn05_prod_profile_verification_state')
  handleProfileVerification(@Payload() message: any) {
    this.logger.log(`Profile verification state topick, ${message?.value}`);
  }

  @EventPattern('vegasnova_hrzn05_prod_converted_payment')
  handlePayment(@Payload() message: any) {
    this.logger.log(`Prod Converted payment topicl, ${message?.value}`);
  }

  @EventPattern('vegasnova_hrzn05_prod_converted_bonus_game')
  handleBonusGame(@Payload() message: any) {
    this.logger.log(`Prod converted bonus game topick, ${message?.value}`);
  }

  @EventPattern('vegasnova_hrzn05_prod_ext_profile')
  handleExtProfile(@Payload() message: any) {
    this.logger.log(`Prod ext profile topick, ${message?.value}`);
  }
}
