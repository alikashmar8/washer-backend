import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateServiceCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  isActive?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Ad image',
    example: 'image.png',
  })
  @IsOptional()
  icon?: any;
}
