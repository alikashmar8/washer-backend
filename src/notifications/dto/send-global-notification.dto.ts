import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class SendGlobalNotificationDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  forEmployees: boolean;
}
