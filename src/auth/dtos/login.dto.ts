import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsOptional, IsEmail } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    required: false,
    minLength: 3,
  })
  @IsOptional()
  @Length(3)
  username?: string;

  @ApiProperty({
    required: false,
    example: 'user@revojok.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Length(6)
  phoneNumber?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Length(6)
  fcmToken?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  password: string;

  deviceInfo?: {
    platform: string;
    isMobile: boolean;
    browser: string;
    version: string;
    os: string;
    source: string;
  };
}
