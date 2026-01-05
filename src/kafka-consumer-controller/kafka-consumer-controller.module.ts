import { Module } from '@nestjs/common';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';
import { KafkaConsumerController } from './kafka-consumer-controller.controller';

@Module({})
export class KafkaConsumerControllerModule {
  providers: [HandleConfigService];
  imports: [HandleConfigModule];
  controllers: [KafkaConsumerController];
}
