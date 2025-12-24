import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandleConfigService } from './shared/services/handle-config-service/handle-config-service.service';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const handleConfig = app.get(HandleConfigService);

  if (!configService.get('PORT')) {
    logger.error('Env was not set properly');
  }
  logger.warn(`handleConfig ${handleConfig.envKFBroker1}`);
  const port = Number(configService.get<number>('PORT') ?? 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);
  await app.listen(port);
  const url = await app.getUrl();
  logger.log(`Ingest service is started at ${port}`);
  logger.log(`URL is ${url}`);
}
void bootstrap();
