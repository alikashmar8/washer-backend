import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
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
  isActive?: boolean;

  icon?: any;
}
