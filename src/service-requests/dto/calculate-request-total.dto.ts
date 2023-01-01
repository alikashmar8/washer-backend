import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional
} from 'class-validator';

export class CalculateRequestTotal {
  @ApiProperty()
  @IsNotEmpty()
  serviceTypeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  tips: number;
}
