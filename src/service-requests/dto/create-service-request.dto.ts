import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { ServiceType } from 'src/common/enums/service-type.enum';

export class CreateServiceRequestDto {
  @ApiProperty({ enum: RequestStatus })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  long: number;

  @ApiProperty({ enum: PaymentType })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ enum: ServiceType })
  @IsNotEmpty()
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  cost: number;

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
