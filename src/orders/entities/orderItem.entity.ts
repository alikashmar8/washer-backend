import { Product } from 'src/products/entities/product.entity';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  price: number;

  @Column({ nullable: false })
  orderId: number;

  // TODO: check deleting product logic // protect or cascade ?
  @Column({ nullable: false })
  productId: number;

  @ManyToOne((type) => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne((type) => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
/*{
  "orderItems": {
"quantity": 2,
"price": 100 ,
"orderId":1 ,
"productId":1 
},
  "total": 200,
  "status": "PENDING"
} */