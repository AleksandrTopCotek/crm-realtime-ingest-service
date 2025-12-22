import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonusApplyService } from './bonus-apply.service';
import { CreateBonusApplyDto } from './dto/create-bonus-apply.dto';
import { UpdateBonusApplyDto } from './dto/update-bonus-apply.dto';

@Controller('bonus-apply')
export class BonusApplyController {
  constructor(private readonly bonusApplyService: BonusApplyService) {}

  @Post()
  create(@Body() createBonusApplyDto: CreateBonusApplyDto) {
    return this.bonusApplyService.create(createBonusApplyDto);
  }

  @Get()
  findAll() {
    return this.bonusApplyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonusApplyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonusApplyDto: UpdateBonusApplyDto) {
    return this.bonusApplyService.update(+id, updateBonusApplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonusApplyService.remove(+id);
  }
}
