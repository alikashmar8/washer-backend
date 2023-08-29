import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class SocialMediaLoginDTO {
  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  @Length(6)
  fcmToken: string;
}
