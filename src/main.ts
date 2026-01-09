import 'dotenv/config';
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
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8080',
        'https://worker-service-960754412379.europe-west1.run.app',
      ],
      credentials: true,
      exposedHeaders: 'set-cookie',
    });
    const handleConfig = app.get(HandleConfigService);
    const configService = app.get(ConfigService);
    //const gcpAuthGuard = app.get(GcpAuthGuard);
    //app.useGlobalGuards(gcpAuthGuard);
    if (!handleConfig.configExisting()) {
      throw new Error('Configs were not set properly!');
    }

    const groupId = handleConfig.getConfig('envKFConsumerGroupName');
    if (groupId.includes('*')) {
      throw new Error(
        `KF_CONS_GROUP_NAME must be an explicit name like 'vegasnova_ingest_api' (no '*'). Got '${groupId}'`,
      );
    }
    if (!groupId.startsWith('vegasnova_')) {
      throw new Error(`KF_CONS_GROUP_NAME must start with 'vegasnova_'. Got '${groupId}'`);
    }

    const brokers = [
      handleConfig.getConfig('envKFBroker1'),
      handleConfig.getConfig('envKFBroker2'),
      handleConfig.getConfig('envKFBroker3'),
    ].filter(Boolean);

    const mechanismEnv = (handleConfig.getConfig('envKFSSL') ?? '').toLowerCase();
    const ssl = (handleConfig.getConfig('envKFSecProt') ?? '').toUpperCase() === 'SASL_SSL';
    const username = handleConfig.getConfig('envKFUsername');
    const password = handleConfig.getConfig('envKFPassword');
    const sasl =
      mechanismEnv === 'plain'
        ? ({ mechanism: 'plain', username, password } as const)
        : mechanismEnv === 'scram-sha-512'
          ? ({ mechanism: 'scram-sha-512', username, password } as const)
          : ({ mechanism: 'scram-sha-256', username, password } as const);

    app.connectMicroservice<KafkaOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
          ssl,
          sasl,
        },
        consumer: {
          groupId,
        },
      },
    });

    if (!configService.get('PORT')) {
      logger.error('Env was not set properly');
    }
    const port = Number(configService.get<number>('PORT') ?? 8080);
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
