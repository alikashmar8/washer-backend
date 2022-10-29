import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  photo?: any;

  @ApiProperty({ type: Array<CreateAddressDto> })
  @ValidateNested()
  addresses: CreateAddressDto[];
}
