import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { OrderItem } from "../entities/orderItem.entity";
import { OrderStatus } from "../enums/order-status.enum";


export class CreateOrderDto {

    @ApiProperty({ type: OrderItem })
    @IsNotEmpty()
    orderItems: OrderItem[];

    @ApiProperty({ nullable: true })
    promoCode: string;

    @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    userId: string;

}
