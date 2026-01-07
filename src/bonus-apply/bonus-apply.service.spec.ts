import { Test, TestingModule } from '@nestjs/testing';
import { BonusApplyService } from './bonus-apply.service';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

describe('BonusApplyService', () => {
  let service: BonusApplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusApplyService, HandleConfigService],
    }).compile();

    service = module.get<BonusApplyService>(BonusApplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
