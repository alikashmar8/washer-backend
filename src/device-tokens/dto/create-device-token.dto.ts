import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDeviceTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty()
  @IsNotEmpty()
  jwtToken: string;
}
