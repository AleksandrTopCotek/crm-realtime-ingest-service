import { Module } from '@nestjs/common';

import { SchemaService } from 'src/shared/services/schema/schema.service';
import { HandleConfigService } from './handle-config-service.service';

@Module({
  providers: [HandleConfigService, SchemaService],
  exports: [HandleConfigService],
})
export class HandleConfigModule {}
