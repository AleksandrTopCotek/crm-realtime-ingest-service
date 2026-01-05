import { Test, TestingModule } from '@nestjs/testing';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { SchemaService } from 'src/shared/services/schema/schema.service';
import { SchemaRegistryService } from 'src/shared/services/schema-registry/schema-registry.service';

describe('DepositController', () => {
  let controller: DepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositController],
      providers: [
        DepositService,
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

    controller = module.get<DepositController>(DepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
