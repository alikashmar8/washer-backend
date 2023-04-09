import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsOptional,
    Length,
    IsBooleanString
  } from 'class-validator';

export class CreateCategoryDto {

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;

}
 
