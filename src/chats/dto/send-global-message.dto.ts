import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendGlobalMessageDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  text: string;
}
