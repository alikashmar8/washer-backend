import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsOptional,
    Length,
    IsBoolean
  } from 'class-validator';

export class CreateCategoryDto {

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}
 
