import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number })
  lat: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number })
  long: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, default: false })
  isDefault: number;

  @ApiProperty()
  @IsOptional()
  userId: string;

  @ApiProperty()
  @IsOptional()
  branchId: string;
}
