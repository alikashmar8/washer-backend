import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
