import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

export class CreateBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  coverageArea: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
