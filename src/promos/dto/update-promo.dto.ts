import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoDto } from './create-promo.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from 'class-validator';
export class UpdatePromoDto extends PartialType(CreatePromoDto) {

    @ApiProperty()
    @IsOptional()
    expiryDate: Date;

    @ApiProperty()
    @IsOptional()
    limit: number;

    @ApiProperty()
    @IsOptional()
    discountPercentage: number;

    @ApiProperty()
    @IsOptional()
    discountAmount: number;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;






}