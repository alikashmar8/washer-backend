import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';


export class CreateOrderItemDto {

    @ApiProperty()
    @IsNotEmpty()
    productId: number;


    @ApiProperty({ default: 1 })
    @IsNotEmpty()
    quantity: number;






}
