import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { removeSpecialCharacters } from 'src/common/utils/functions';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Branch } from './../../branches/entities/branch.entity';

@Entity('employees')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: EmployeeRole, default: EmployeeRole.DRIVER })
  role: EmployeeRole;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: true })
  passwordResetCode?: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetExpiry?: Date;

  @Column({ nullable: true })
  branchId?: string;

  @ManyToOne((type) => Branch, (branch) => branch.employees, {
    onDelete: 'CASCADE',
  })
  branch?: Branch;

  @Exclude()
  @OneToMany((type) => ServiceRequest, (req) => req.employee, {
    cascade: true,
  })
  requests: ServiceRequest[];

  @OneToMany((type) => DeviceToken, (deviceToken) => deviceToken.employee, {
    cascade: true,
  })
  deviceTokens: DeviceToken[];

  @OneToMany((type) => Notification, (notification) => notification.employee)
  notifications: Notification[];

  @BeforeInsert()
  async hashPassword() {
    this.username = this.username
      ? this.username
      : removeSpecialCharacters(this.first_name + this.last_name) + Date.now();
    const password = this.password ? this.password : this.username;
    const hash = await argon.hash(password);
    this.password = hash;
    this.email = this.email ? this.email.toLowerCase() : null;
  }
}
