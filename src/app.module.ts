import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HandleConfigService } from './shared/services/handle-config-service/handle-config-service.service';
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
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { CellExpertModule } from './cell-expert/cell-expert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IngestServiceModule,
    BonusCreditModule,
    BonusApplyModule,
    DepositModule,
    ProfileModule,
    HandleConfigModule,
    GcpAuthModule,
    KafkaConsumerControllerModule,
    PaymentModule,
    PrismaModule,
    CellExpertModule,
  ],
  controllers: [AppController],
  providers: [AppService, HandleConfigService, IngestServiceService, SchemaService],
})
export class AppModule {}
