import { Module } from '@nestjs/common';
import { KafkaConsumerController } from './kafka-consumer-controller.controller';
import { SchemaRegistryModule } from 'src/shared/services/schema-registry/schema-registry.module';

@Module({
  imports: [SchemaRegistryModule],
  controllers: [KafkaConsumerController],
})
export class KafkaConsumerControllerModule {}
