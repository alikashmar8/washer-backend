import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PaymentType } from 'src/common/enums/payment-type.enum';

export class CreateServiceRequestItemDTO {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  typeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId?: string;
}
export class CreateServiceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  requestedDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ enum: PaymentType })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

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
  promoCode?: string;

  @ApiProperty({ type: CreateServiceRequestItemDTO, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateServiceRequestItemDTO)
  @IsNotEmpty()
  @ArrayMinSize(1)
  serviceRequestItems: CreateServiceRequestItemDTO[];

  //userId & branchId are auto set in code
  userId: string;
  branchId: string;
}
