import { VehicleType } from 'src/common/enums/vehicle-type.enum';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base-entity.entity';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: true })
  year?: string;

  @Column({ nullable: false })
  plateSymbol: string;

  @Column({ nullable: false })
  plateNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  color: string;

  @Column({ nullable: false })
  photo: string;

  @Column({ type: 'enum', enum: VehicleType, default: VehicleType.CAR })
  type: VehicleType;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne((type) => User, (user) => user.vehicles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany((type) => ServiceRequest, (req) => req.vehicle, {
    cascade: true,
  })
  requests: ServiceRequest[];
}
