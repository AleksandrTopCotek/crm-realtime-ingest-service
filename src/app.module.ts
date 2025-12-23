import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HandleConfigServiceService } from './shared/services/handle-config-service/handle-config-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IngestServiceService } from './ingest-service/ingest-service.service';
import { IngestServiceModule } from './ingest-service/ingest-service.module';
import { BonusCreditModule } from './bonus-credit/bonus-credit.module';
import { BonusApplyModule } from './bonus-apply/bonus-apply.module';
import { DepositModule } from './deposit/deposit.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['KAFKA_BROKER:9092'], // замените на ваш брокер
          },
          consumer: {
            groupId: 'payment-consumer-group', // уникальный ID группы
          },
        },
      },
    ]),
    IngestServiceModule,
    BonusCreditModule,
    BonusApplyModule,
    DepositModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, HandleConfigServiceService, IngestServiceService],
})
export class AppModule {}
