import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDeviceTokenDto } from './create-device-token.dto';

export class CreateUserDeviceTokenDto extends CreateDeviceTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
