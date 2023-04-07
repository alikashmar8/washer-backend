import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  icon: string;

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

  @Column({ nullable: false })
  isActive: boolean;
}
