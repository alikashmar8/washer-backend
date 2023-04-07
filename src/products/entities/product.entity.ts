import { Category } from 'src/categories/entities/category.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { OrderItem } from 'src/orders/entities/orderItem.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../enums/product-category.enum';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => ProductImage, (image) => image.product)
  images: ProductImage[];

  // @ManyToOne((type) => Shop, (shop) => shop.products, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'shopId' })
  // shop: Shop;

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne((type) => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: false, default: 0 })
  views: number;
}
