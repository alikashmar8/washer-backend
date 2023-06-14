import { ChatSenderType } from './chat-sender-type.dto';
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

  // set in code based on who is the sender 
  lastSenderType: ChatSenderType;
  // Either userId or employeeId will be set in code
  userId: string;
  employeeId: string;
}
