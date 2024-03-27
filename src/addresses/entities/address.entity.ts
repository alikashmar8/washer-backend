import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Branch } from '../../branches/entities/branch.entity';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: false })
  city: string;

  @Column({ type: 'text', nullable: true })
  region?: string;

  @Column({ type: 'text', nullable: false })
  street: string;

  @Column({ type: 'text', nullable: false })
  building: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 11, scale: 7, nullable: false })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 7, nullable: false })
  lon: number;

  @Column({ default: false })
  isDefault: boolean;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

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

  @OneToMany((type) => ServiceRequest, (req) => req.address, {
    cascade: true,
  })
  requests: ServiceRequest[];

  public get isUserAddress(): boolean {
    return !!this.userId;
  }
}
