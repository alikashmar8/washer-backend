import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum, IsNotEmpty,
  IsNumber,
  IsOptional, IsString, Length
} from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../enums/product-category.enum';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Product title',
  })
  @Length(1, 100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Product description',
    example: 'Product description',
    minLength: 1,
    maxLength: 255,
    nullable: true,
  })
  @Length(1, 255)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    enum: Currency,
    required: false,
    example: Currency.LBP,
    nullable: true,
    default: Currency.LBP,
  })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;




  @ApiProperty({
    enum: ProductCategory,
    required: true,
    nullable: false,
    example: ProductCategory.PLANT,
  })
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  images: any[];


}
