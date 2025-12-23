import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SchemaService } from 'src/shared/services/schema/schema.service';

@Module({ controllers: [ProfileController], providers: [ProfileService, SchemaService] })
export class ProfileModule {}
