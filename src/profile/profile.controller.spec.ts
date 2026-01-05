import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: SchemaService,
          useValue: {
            getSchema: jest.fn(),
          },
        },
        {
          provide: SchemaRegistryService,
          useValue: {
            decodeConfluentAvro: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
