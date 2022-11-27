import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  isActive?: boolean;

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
  showVehicleSelection?: boolean;

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
  showQuantityInput?: boolean;

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
  isMotoAllowed?: boolean;

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
