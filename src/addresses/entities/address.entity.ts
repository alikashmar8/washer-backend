import { Branch } from 'src/branches/entities/branch.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { User } from 'src/users/entities/user.entity';
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
import { BaseEntity } from '../../common/entities/base-entity.entity';

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

  @Column({ type: 'float', nullable: false })
  lat: number;

  @Column({ type: 'float', nullable: false })
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
