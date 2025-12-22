import { Test, TestingModule } from '@nestjs/testing';
import { BonusCreditService } from './bonus-credit.service';

describe('BonusCreditService', () => {
  let service: BonusCreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonusCreditService],
    }).compile();

    service = module.get<BonusCreditService>(BonusCreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
