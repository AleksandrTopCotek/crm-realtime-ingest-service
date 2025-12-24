import { Module } from '@nestjs/common';
import { GcpAuthGuard } from './gcp-auth.guard';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';

@Module({
  providers: [GcpAuthGuard],
  exports: [GcpAuthGuard],
  imports: [HandleConfigModule],
})
export class GcpAuthModule {}
