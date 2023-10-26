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
  @IsOptional()
  region?: string;
  
  @ApiProperty()
  @IsNotEmpty()
  street: string;
  
  @ApiProperty()
  @IsNotEmpty()
  building: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  lon: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, default: false })
  isDefault: boolean;
}
