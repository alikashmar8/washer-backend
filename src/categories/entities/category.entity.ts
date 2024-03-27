import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToOne((type) => Category, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany((type) => Category, (category) => category.parent, {
    cascade: true,
    nullable: true,
  })
  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];

  @JoinColumn({ name: 'categoryId' })
  children?: Category[];

  @Column({ default: false })
  isActive: boolean;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
