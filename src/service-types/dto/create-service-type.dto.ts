import { IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "src/common/enums/currency.enum";

export class CreateServiceTypeDto {
@ApiProperty()
@IsNotEmpty()
categoryId: string;

@ApiProperty()
@IsNotEmpty()
name: string;

@ApiProperty({
  nullable: false,
  type: Number,
})
@IsNotEmpty()
price: number;

@ApiProperty({
  enum: Currency,
  required: false,
  description: 'service price currency',
  default: Currency.LBP,
})
@IsOptional()
@IsEnum(Currency)
currency?: Currency;

@ApiProperty({
  type: Boolean,
  default: true,
  nullable: true,
  required: false
})
@IsOptional()
@IsBoolean()
isActive?: boolean;
}
