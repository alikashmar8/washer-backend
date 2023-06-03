import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserChatDto {
  @ApiProperty()
  @IsNotEmpty()
  employeeId: string;

  userId: string;
}