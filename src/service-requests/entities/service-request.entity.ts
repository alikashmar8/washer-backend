import { Address } from 'src/addresses/entities/address.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { generateUniqueCode } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceType } from 'src/service-types/entities/service-type.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequestItem } from './service-request-item.entity';

@Entity('service-requests')
export class ServiceRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING_APPROVAL,
  })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  cancelReason?: string;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedDate?: Date;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.CASH })
  paymentType: PaymentType;

  @OneToMany((type) => ServiceRequestItem, (item) => item.serviceRequest, {
    cascade: true,
  })
  serviceRequestItems: ServiceRequestItem[];

  @Column({ type: 'float', nullable: false })
  cost: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  tips: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ default: false })
  isClientVerified: boolean;

  @Column({ type: 'text', nullable: false })
  verificationCode: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  employeeId?: string;

  @Column({ nullable: false })
  branchId: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: false })
  addressId: string;

  @ManyToOne((type) => User, (user) => user.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Address, (add) => add.requests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'addressId' })
  address?: Address;

  @ManyToOne((type) => Employee, (employee) => employee.requests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;

  @ManyToOne((type) => Branch, (branch) => branch.requests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

  @ManyToOne((type) => Transaction, (transaction) => transaction.requests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction?: Transaction;

  @BeforeInsert()
  async hashPassword() {
    this.verificationCode = generateUniqueCode();
  }
}
