import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HandleConfigService } from './shared/services/handle-config-service/handle-config-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IngestServiceService } from './ingest-service/ingest-service.service';
import { IngestServiceModule } from './ingest-service/ingest-service.module';
import { BonusCreditModule } from './bonus-credit/bonus-credit.module';
import { BonusApplyModule } from './bonus-apply/bonus-apply.module';
import { DepositModule } from './deposit/deposit.module';
import { ProfileModule } from './profile/profile.module';
import { SchemaService } from './shared/services/schema/schema.service';
import { HandleConfigModule } from './shared/services/handle-config-service/handle-config-service.module';
import { GcpAuthModule } from './gcp-auth/gcp-auth.module';
import { KafkaConsumerControllerModule } from './kafka-consumer-controller/kafka-consumer-controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        imports: [HandleConfigModule],
        name: 'KAFKA_TOPIC', //process.env.KF_TOPIC_NAME as string,
        inject: [HandleConfigService],
        useFactory: (cfg: HandleConfigService) => {
          const brokers = [cfg.envKFBroker1, cfg.envKFBroker2, cfg.envKFBroker3].filter((b): b is string => Boolean(b));

          const mechanismEnv = (cfg.envKFSSL ?? '').toLowerCase();
          const ssl = (cfg.envKFSecProt ?? '').toUpperCase() === 'SASL_SSL';
          const username = cfg.envKFUsername ?? '';
          const password = cfg.envKFPassword ?? '';
          const sasl =
            mechanismEnv === 'plain'
              ? ({ mechanism: 'plain', username, password } as const)
              : mechanismEnv === 'scram-sha-512'
                ? ({ mechanism: 'scram-sha-512', username, password } as const)
                : ({ mechanism: 'scram-sha-256', username, password } as const);

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers,
                ssl,
                sasl,
              },
              consumer: {
                groupId: cfg.envKFConsumerGroupName ?? 'vegasnova_default_group',
              },
            },
          };
        },
      },
    ]),
    IngestServiceModule,
    BonusCreditModule,
    BonusApplyModule,
    DepositModule,
    ProfileModule,
    HandleConfigModule,
    GcpAuthModule,
    KafkaConsumerControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService, HandleConfigService, IngestServiceService, SchemaService],
})
export class AppModule {}
