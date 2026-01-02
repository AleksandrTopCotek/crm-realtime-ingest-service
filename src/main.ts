import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandleConfigService } from './shared/services/handle-config-service/handle-config-service.service';
import { KafkaOptions, Transport } from '@nestjs/microservices';
//import { GcpAuthGuard } from './gcp-auth/gcp-auth.guard';

async function bootstrap() {
  const logger = new Logger();

  try {
    const app = await NestFactory.create(AppModule);

    const handleConfig = app.get(HandleConfigService);
    const configService = app.get(ConfigService);
    //const gcpAuthGuard = app.get(GcpAuthGuard);
    //app.useGlobalGuards(gcpAuthGuard);
    if (!handleConfig.configExisting()) {
      throw new Error('Configs were not set properly!');
    }
    app.connectMicroservice<KafkaOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [
            handleConfig.getConfig('envKFBroker1'),
            handleConfig.getConfig('envKFBroker2'),
            handleConfig.getConfig('envKFBroker3'),
          ],
          ssl: true,
          sasl: {
            mechanism: 'scram-sha-256',
            username: handleConfig.getConfig('envKFUsername'),
            password: handleConfig.getConfig('envKFPassword'),
          },
        },
        consumer: {
          groupId: handleConfig.getConfig('envKFConsumerGroupName'),
        },
      },
    });

    if (!configService.get('PORT')) {
      logger.error('Env was not set properly');
    }
    const port = Number(configService.get<number>('PORT') ?? 3000);
    const apiPrefix = configService.get<string>('API_PREFIX', 'api');
    app.setGlobalPrefix(apiPrefix);
    await app.listen(port);
    await app.startAllMicroservices();
    const url = await app.getUrl();
    logger.log(`Ingest service is started at ${port}`);
    logger.log(`URL is ${url}`);
  } catch (e: unknown) {
    logger.error(`Error during starting app - ${e as string}`);
    throw new Error('Error during starting app');
  }
}
void bootstrap();
