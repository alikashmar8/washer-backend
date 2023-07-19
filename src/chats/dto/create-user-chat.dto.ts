import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserChatDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  employeeId: string;
}
