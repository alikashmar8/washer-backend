import { Branch } from 'src/branches/entities/branch.entity';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { generateUniqueCode } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceType } from 'src/service-types/entities/service-type.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dueDate: Date;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'float', nullable: false })
  lat: number;

  @Column({ type: 'float', nullable: false })
  long: number;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.CASH })
  paymentType: PaymentType;

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

  @Column({ nullable: true })
  vehicleId?: string;

  @Column({ nullable: false })
  branchId: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: false })
  typeId: string;

  @ManyToOne((type) => User, (user) => user.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Vehicle, (v) => v.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;

  @ManyToOne((type) => Employee, (employee) => employee.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;

  @ManyToOne((type) => Branch, (branch) => branch.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

  @ManyToOne((type) => Transaction, (transaction) => transaction.requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transactionId' })
  transaction?: Transaction;

  @ManyToOne((type) => ServiceType, (type) => type.serviceRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'typeId' })
  type: ServiceType;

  @BeforeInsert()
  async hashPassword() {
    this.verificationCode = generateUniqueCode();
  }
}
