import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonusCreditService } from './bonus-credit.service';
import { CreateBonusCreditDto } from './dto/create-bonus-credit.dto';
import { UpdateBonusCreditDto } from './dto/update-bonus-credit.dto';

@Controller('bonus-credit')
export class BonusCreditController {
  constructor(private readonly bonusCreditService: BonusCreditService) {}

  @Post()
  create(@Body() createBonusCreditDto: CreateBonusCreditDto) {
    return this.bonusCreditService.create(createBonusCreditDto);
  }

  @Get()
  findAll() {
    return this.bonusCreditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonusCreditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonusCreditDto: UpdateBonusCreditDto) {
    return this.bonusCreditService.update(+id, updateBonusCreditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonusCreditService.remove(+id);
  }
}
