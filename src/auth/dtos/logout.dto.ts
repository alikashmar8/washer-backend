import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDTO {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
