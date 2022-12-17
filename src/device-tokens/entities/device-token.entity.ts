import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('device-tokens')
export class DeviceToken extends BaseEntity {
  @Column({ nullable: false })
  token: string;

  @Column({ nullable: true })
  fcmToken?: string;

  @Column({ nullable: false })
  platform: string;

  @Column({ nullable: false })
  isMobile: boolean;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  version?: string;

  @Column({ nullable: false })
  os: string;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'enum', enum: DeviceTokenStatus, default: DeviceTokenStatus.ACTIVE })
  status: DeviceTokenStatus;

  @Column({ type: 'timestamp', nullable: true, default: null})
  loggedOutAt?: Date;

  @Column({ type: 'timestamp', nullable: true, default: null})
  lastRequestAt?: Date;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  employeeId?: string;

  @ManyToOne((type) => User, (user) => user.deviceTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne((type) => Employee, (employee) => employee.deviceTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;
}
