import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDeviceTokenDto } from './create-device-token.dto';

export class CreateEmployeeDeviceTokenDto extends CreateDeviceTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  employeeId: string;
}
