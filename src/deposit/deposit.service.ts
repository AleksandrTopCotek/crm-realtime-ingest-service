import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';

@Injectable()
export class DepositService {
  create(_createDepositDto: CreateDepositDto) {
    void _createDepositDto;
    return 'This action adds a new deposit';
  }

  findAll() {
    return `This action returns all deposit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deposit`;
  }

  update(id: number, _updateDepositDto: UpdateDepositDto) {
    void _updateDepositDto;
    return `This action updates a #${id} deposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} deposit`;
  }
}
