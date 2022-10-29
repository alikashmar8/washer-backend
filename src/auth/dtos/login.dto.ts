import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
