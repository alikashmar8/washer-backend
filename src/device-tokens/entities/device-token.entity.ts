import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('device-tokens')
export class DeviceToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  jwtToken: string;

  @Column({ nullable: false })
  fcmToken: string;

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
