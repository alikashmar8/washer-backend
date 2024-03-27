import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from '../../chats/entities/chat.entity';
import { Message } from '../../chats/entities/message.entity';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import { EmployeeRole } from '../../common/enums/employee-role.enum';
import { removeSpecialCharacters } from '../../common/utils/functions';
import { DeviceToken } from '../../device-tokens/entities/device-token.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { ServiceRequest } from '../../service-requests/entities/service-request.entity';
import { Branch } from './../../branches/entities/branch.entity';

@Entity('employees')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ name: 'username', nullable: false, unique: false })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'email', nullable: true, unique: false })
  email?: string;

  @Column({ name: 'phoneNumber', nullable: false, unique: false })
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

  @Column({ type: 'decimal', precision: 11, scale: 7, nullable: true })
  currentLongitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 7, nullable: true })
  currentLatitude?: number;

  @Column({ nullable: true })
  branchId?: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

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

  @Exclude()
  @OneToMany((type) => Message, (message) => message.user)
  messages: Message[];

  @Exclude()
  @OneToMany((type) => Chat, (chat) => chat.employee)
  chats: Chat[];

  @BeforeInsert()
  async hashPassword() {
    this.username = this.username
      ? this.username
      : removeSpecialCharacters(this.firstName + this.lastName) + Date.now();
    const password = this.password ? this.password : this.username;
    const hash = await argon.hash(password);
    this.password = hash;
    this.email = this.email ? this.email.toLowerCase() : null;
  }
}
