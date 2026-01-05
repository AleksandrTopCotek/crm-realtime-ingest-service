import { Module } from '@nestjs/common';
import { KafkaConsumerController } from './kafka-consumer-controller.controller';

@Module({
  controllers: [KafkaConsumerController],
})
export class KafkaConsumerControllerModule {}
