import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateServiceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  confirmedDate: Date;
}
