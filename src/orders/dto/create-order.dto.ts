import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { OrderItem } from "../entities/orderItem.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./create-orderItem.dto";


export class CreateOrderDto {

    @ApiProperty({ type: CreateOrderItemDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    orderItems: CreateOrderItemDto[];

    @ApiProperty({ nullable: true })
    promoCode: string;

    @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    userId: string;

}
