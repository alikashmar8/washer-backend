import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  employeeId: string;
}
