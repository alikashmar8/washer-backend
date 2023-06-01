import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEmployeeChatDTO {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  employeeId: string;
}
