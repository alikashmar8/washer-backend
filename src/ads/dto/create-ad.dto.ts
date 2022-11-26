import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsBooleanString()
  isActive?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Ad image',
    example: 'image.png',
  })
  @IsOptional()
  image: any;
}
