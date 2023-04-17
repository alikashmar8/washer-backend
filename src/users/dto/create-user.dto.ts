import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  ValidateNested
} from 'class-validator';
import { passwordRegex } from 'src/common/constants';
import { CreateWalletDto } from 'src/wallets/dto/create-wallet.dto';

export class CreateUserDto {
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
  @Matches(passwordRegex, { message: 'Weak password' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  phoneNumber: string;

  
  @ApiProperty({ type: CreateWalletDto, isArray: false })
  @ValidateNested()
  @Type(() => CreateWalletDto)
  wallet: CreateWalletDto

}
