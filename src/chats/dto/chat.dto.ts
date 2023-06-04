import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  chatId: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  text: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  sentTimestamp: number;

  // Either userId or employeeId will be set in code
  userId: string;
  employeeId: string;
}
