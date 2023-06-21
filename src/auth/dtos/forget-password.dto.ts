import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  email: string;
}

export class PasswordResetDTO extends ForgetPasswordDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  passwordResetCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  newPassword: string;
}
