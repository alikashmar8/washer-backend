import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  value: string;
}
