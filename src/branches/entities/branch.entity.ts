import { Address } from 'src/addresses/entities/address.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('branches')
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: false })
  isActive: boolean;
  
  @Column({ nullable: false, default: 1000 })
  coverageArea: number; // field value in meters
  
  @Column({ nullable: false })
  addressId: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToOne((type) => Address, (address) => address.branch, {
    cascade: true,
  })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany((type) => Employee, (employee) => employee.branch, {
    cascade: true,
  })
  employees: Employee[];

  @OneToMany((type) => ServiceRequest, (req) => req.branch, {
    cascade: true,
  })
  requests: ServiceRequest[];
}
