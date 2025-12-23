import { Injectable } from '@nestjs/common';
import { CreateBonusCreditDto } from './dto/create-bonus-credit.dto';
import { UpdateBonusCreditDto } from './dto/update-bonus-credit.dto';

@Injectable()
export class BonusCreditService {
  create(_createBonusCreditDto: CreateBonusCreditDto) {
    return 'This action adds a new bonusCredit';
  }

  findAll() {
    return `This action returns all bonusCredit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bonusCredit`;
  }

  update(id: number, _updateBonusCreditDto: UpdateBonusCreditDto) {
    return `This action updates a #${id} bonusCredit`;
  }

  remove(id: number) {
    return `This action removes a #${id} bonusCredit`;
  }
}
