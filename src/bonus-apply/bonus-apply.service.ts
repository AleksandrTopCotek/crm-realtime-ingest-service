import { Injectable } from '@nestjs/common';
import { CreateBonusApplyDto } from './dto/create-bonus-apply.dto';
import { UpdateBonusApplyDto } from './dto/update-bonus-apply.dto';

@Injectable()
export class BonusApplyService {
  create(_createBonusApplyDto: CreateBonusApplyDto) {
    void _createBonusApplyDto;
    return 'This action adds a new bonusApply';
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
