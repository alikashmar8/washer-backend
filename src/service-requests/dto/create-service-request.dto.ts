import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { ServiceRequestItem } from '../entities/service-request-item.entity';
import { Type } from 'class-transformer';

export class CreateServiceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  requestedDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: PaymentType })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty()
  @IsNotEmpty()
  typeId: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  tips: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  promoCode?: string;

  @ApiProperty({ type: ServiceRequestItem, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => ServiceRequestItem)
  serviceRequestItems: ServiceRequestItem[];


  //userId & branchId are auto set in code
  userId: string;
  branchId: string;
}
