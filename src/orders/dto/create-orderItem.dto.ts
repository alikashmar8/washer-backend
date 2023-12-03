import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
  
  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  // The following attributes are not passed in request
  price: number;
  orderId: number;
}
