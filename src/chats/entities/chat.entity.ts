import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from '../../employees/entities/employee.entity';
import { User } from '../../users/entities/user.entity';
import { ChatSenderType } from '../dto/chat-sender-type.dto';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  employeeId: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  lastMessage?: string;

  @Column({ nullable: true })
  lastMessageDate?: Date;

  @Column({ nullable: true, type: 'enum', enum: ChatSenderType })
  lastSenderType?: ChatSenderType;

  @ManyToOne((type) => User, (user) => user.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Employee, (employee) => employee.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;

  @OneToMany((type) => Message, (message) => message.chat)
  messages: Message[];

  unReadCount: number;
}
