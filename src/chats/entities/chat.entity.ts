import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  employeeId: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  lastMessage: string;

  @Column({ nullable: false })
  lastMessageDate: Date;

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
}
