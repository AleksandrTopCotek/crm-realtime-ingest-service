import { Module } from '@nestjs/common';
import { KafkaConsumerController } from './kafka-consumer-controller.controller';
import { SchemaRegistryModule } from 'src/shared/services/schema-registry/schema-registry.module';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';
import { PaymentModule } from 'src/payment/payment.module';
import { BonusApplyModule } from 'src/bonus-apply/bonus-apply.module';
import { BonusApplyService } from 'src/bonus-apply/bonus-apply.service';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Module({
  imports: [SchemaRegistryModule, HandleConfigModule, PaymentModule, BonusApplyModule],
  providers: [BonusApplyService, SchemaService],
  controllers: [KafkaConsumerController],
})
export class KafkaConsumerControllerModule {}
