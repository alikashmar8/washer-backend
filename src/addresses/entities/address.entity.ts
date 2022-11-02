import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base-entity.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  long?: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne((type) => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToOne((type) => Branch, (branch) => branch.address, {
    onDelete: 'CASCADE',
  })
  branch?: Branch;

  public get isUserAddress(): boolean {
    return !!this.userId;
  }
}
