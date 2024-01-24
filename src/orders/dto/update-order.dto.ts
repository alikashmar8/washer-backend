import { PartialType } from '@nestjs/mapped-types';
import { OrderItem } from '../entities/orderItem.entity';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    orderItems: OrderItem[];

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}
