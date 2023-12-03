import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateServiceRequestItemDTO } from './create-service-request.dto';

export class CalculateRequestTotal {
  @ApiProperty({ type: CreateServiceRequestItemDTO, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateServiceRequestItemDTO)
  @IsNotEmpty()
  @ArrayMinSize(1)
  serviceRequestItems: CreateServiceRequestItemDTO[];

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
