import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional
} from 'class-validator';
import { Promo } from 'src/promos/entities/promo.entity';

export class CalculateRequestTotal {
  @ApiProperty()
  @IsNotEmpty()
  serviceTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  promoCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  tips: number;
}
