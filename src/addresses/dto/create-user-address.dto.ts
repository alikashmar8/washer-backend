import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  userId: string;
}
