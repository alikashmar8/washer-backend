import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './orderItem.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  total: number;

  @Column({ nullable: true })
  userId: string;


  @ManyToOne((type) => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;


  @OneToMany((type) => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
