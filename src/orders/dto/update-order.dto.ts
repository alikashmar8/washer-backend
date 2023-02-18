import { PartialType } from '@nestjs/mapped-types';
import { OrderItem } from '../entities/orderItem.entity';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    orderItems: OrderItem[];
}
