import { Category } from 'src/categories/entities/category.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { OrderItem } from 'src/orders/entities/orderItem.entity';

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
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  price: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Currency,
    default: Currency.LBP,
  })
  currency: Currency;
  
  @Column({ nullable: false, default: 0 })
  views: number;

  @Column({nullable:false,type:'boolean',default:true})
  isActive:boolean;
  
  @Column({ nullable: false ,default:1})
  categoryId: string;

  @OneToMany((type) => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne((type) => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}