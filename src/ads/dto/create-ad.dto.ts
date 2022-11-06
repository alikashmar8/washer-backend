import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  image: string;
}
