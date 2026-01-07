import { Injectable, Logger } from '@nestjs/common';
import { CreateBonusApplyDto } from './dto/create-bonus-apply.dto';
import { UpdateBonusApplyDto } from './dto/update-bonus-apply.dto';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

@Injectable()
export class BonusApplyService {
  logger = new Logger();
  constructor(private readonly hcs: HandleConfigService) {}
  async create(_createBonusApplyDto: CreateBonusApplyDto) {
    try {
      const url = this.hcs.workerEndpoint('/api/bonus');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          body: _createBonusApplyDto,
        }),
      });
      this.logger.debug(`Worker response: ${res.status} ${res.statusText}`);
      return;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  findAll() {
    return `This action returns all bonusApply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bonusApply`;
  }

  update(id: number, _updateBonusApplyDto: UpdateBonusApplyDto) {
    void _updateBonusApplyDto;
    return `This action updates a #${id} bonusApply`;
  }

  remove(id: number) {
    return `This action removes a #${id} bonusApply`;
  }
}
