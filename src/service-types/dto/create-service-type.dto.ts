import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Currency } from 'src/common/enums/currency.enum';

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
    default: Currency.USD,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showVehicleSelection?: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showQuantityInput?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Ad image',
    example: 'image.png',
  })
  @IsOptional()
  icon: string;
}
