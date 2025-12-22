import { Test, TestingModule } from '@nestjs/testing';
import { BonusCreditController } from './bonus-credit.controller';
import { BonusCreditService } from './bonus-credit.service';

describe('BonusCreditController', () => {
  let controller: BonusCreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusCreditController],
      providers: [BonusCreditService],
    }).compile();

    controller = module.get<BonusCreditController>(BonusCreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
