import { PartialType } from '@nestjs/mapped-types';
import { CreateBonusApplyDto } from './create-bonus-apply.dto';

export class UpdateBonusApplyDto extends PartialType(CreateBonusApplyDto) {}
