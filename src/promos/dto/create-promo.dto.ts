import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional,Max } from 'class-validator';
export class CreatePromoDto {

    @ApiProperty()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsOptional()
    expiryDate: Date;

    @ApiProperty()
    @IsOptional()
    limit: number;

    @ApiProperty()
    @IsOptional()
    numberOfUsage: number;

    @ApiProperty()
    @IsOptional()
    @Max(100)
    discountPercentage: number;

    @ApiProperty()
    @IsOptional()
    discountAmount: number;

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;

    @ApiProperty()
    @IsNotEmpty()
    userId: string;


}
