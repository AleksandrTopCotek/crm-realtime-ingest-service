import { PartialType } from '@nestjs/mapped-types';
import { CreateBonusCreditDto } from './create-bonus-credit.dto';

export class UpdateBonusCreditDto extends PartialType(CreateBonusCreditDto) {}
