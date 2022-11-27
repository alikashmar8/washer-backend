import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateAddressDto {

  @ApiProperty()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty()
  @IsNotEmpty()
  city: string;
  
  @ApiProperty()
  @IsNotEmpty()
  region: string;
  
  @ApiProperty()
  @IsNotEmpty()
  street: string;
  
  @ApiProperty()
  @IsNotEmpty()
  building: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  lat: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  long: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, default: false })
  isDefault: boolean;
}
