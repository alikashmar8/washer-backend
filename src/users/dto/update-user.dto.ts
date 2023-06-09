import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @Length(3, 64)
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 64)
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 64)
  username?: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @Length(6, 32)
  phoneNumber: string;
}
