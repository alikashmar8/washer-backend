import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Promo } from 'src/promos/entities/promo.entity';
import { ServiceRequestItem } from '../entities/service-request-item.entity';
import { Type } from 'class-transformer';

export class CalculateRequestTotal {
  @ApiProperty({ type: ServiceRequestItem, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ServiceRequestItem)
  serviceRequestItems: ServiceRequestItem[];

  @ApiProperty()
  @IsOptional()
  promoCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  tips: number;

  userId: string;
}
