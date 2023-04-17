import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  productId: string;

  @ManyToOne((type) => Product, (product) => product.images, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'productId' })
  product: Product;
}
