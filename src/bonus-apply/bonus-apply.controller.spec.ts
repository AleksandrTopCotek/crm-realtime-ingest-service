import { Test, TestingModule } from '@nestjs/testing';
import { BonusApplyController } from './bonus-apply.controller';
import { BonusApplyService } from './bonus-apply.service';
import { HandleConfigModule } from 'src/shared/services/handle-config-service/handle-config-service.module';

describe('BonusApplyController', () => {
  let controller: BonusApplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonusApplyController],
      providers: [BonusApplyService],
      imports: [HandleConfigModule],
    }).compile();

    controller = module.get<BonusApplyController>(BonusApplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
