import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promos')
export class Promo extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ type: 'integer', nullable: true, default: 0 })
  limit?: number;

  @Column({ type: 'integer', default: 0 })
  numberOfUsage?: number;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne((type) => User, (user) => user.promos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  discountPercentage?: number;

  @Column({ nullable: true })
  discountAmount?: number;

  @Column({ nullable: false })
  isActive: boolean;

  public get isLimited(): boolean {
    return this.limit != null && this.limit > 0;
  }
}
