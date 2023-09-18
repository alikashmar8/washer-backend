import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class UpdateLocationDto {
  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsNumber()
  readonly latitude?: number;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsNumber()
  readonly longitude?: number;
}
