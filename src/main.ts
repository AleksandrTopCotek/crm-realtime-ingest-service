import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandleConfigService } from './shared/services/handle-config-service/handle-config-service.service';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const handleConfig = app.get(HandleConfigService);
  const configService = app.get(ConfigService);
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
  await app.startAllMicroservices();
  await app.listen(port);
  const url = await app.getUrl();
  logger.log(`Ingest service is started at ${port}`);
  logger.log(`URL is ${url}`);
}
void bootstrap();
