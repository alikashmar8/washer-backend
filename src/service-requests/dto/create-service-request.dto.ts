import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional
} from 'class-validator';
import { PaymentType } from 'src/common/enums/payment-type.enum';

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

  @ApiProperty({ required: false })
  @IsOptional()
  vehicleId: string;

  //userId & branchId are auto set in code
  userId: string;
  branchId: string;
}
