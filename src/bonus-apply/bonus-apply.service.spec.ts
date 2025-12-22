import { Test, TestingModule } from '@nestjs/testing';
import { BonusApplyService } from './bonus-apply.service';

describe('BonusApplyService', () => {
  let service: BonusApplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusApplyService],
    }).compile();

    service = module.get<BonusApplyService>(BonusApplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
