import { Test, TestingModule } from '@nestjs/testing';
import { BonusApplyController } from './bonus-apply.controller';
import { BonusApplyService } from './bonus-apply.service';

describe('BonusApplyController', () => {
  let controller: BonusApplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusApplyController],
      providers: [BonusApplyService],
    }).compile();

    controller = module.get<BonusApplyController>(BonusApplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
