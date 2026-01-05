import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryModule } from 'src/shared/services/schema-registry/schema-registry.module';

@Module({ imports: [SchemaRegistryModule], controllers: [ProfileController], providers: [ProfileService, SchemaService] })
export class ProfileModule {}
