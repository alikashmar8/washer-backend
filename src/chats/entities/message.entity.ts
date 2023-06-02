import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  video?: string;

  @Column({ nullable: true })
  audio?: string;

  @Column({ nullable: false, default: false })
  isRead: boolean;

  @Column({ nullable: false })
  chatId: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  employeeId?: string;

  @ManyToOne((type) => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @ManyToOne((type) => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne((type) => Employee, (employee) => employee.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
