import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  chatId: string;
  
  @IsNotEmpty()
  @ApiProperty({ type: String })
  message: string;

  // Either userId or employeeId will be set in code
  userId: string;
  employeeId: string;
}
