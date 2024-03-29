import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  ValidateNested,
  Matches,
  IsArray,
  IsPhoneNumber,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { passwordRegex } from 'src/common/constants';

export class RegisterUserDTO {
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

  @ApiProperty({
    type: String,
    description: `${passwordRegex}`,
  })
  // @Matches(passwordRegex, { message: 'Weak password' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(6, 32)
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @Length(4, 32)
  referralCode: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  photo?: any;

  @ApiProperty({ type: CreateAddressDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[];
}
