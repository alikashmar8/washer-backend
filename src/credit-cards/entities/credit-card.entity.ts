import creditCardType from 'credit-card-type';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('credit-cards')
export class CreditCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;
  
  @Column({ type: 'text', nullable: true })
  cardHolderName: string;

  @Column({ nullable: false })
  cardNumber: string;

  @Column()
  expiryDate: Date;

  @Column()
  cvcNumber: string;

  @Column()
  type: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column()
  userId: string;

  @ManyToOne((type) => User, (user) => user.creditCards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany((type) => Transaction, (transaction) => transaction.wallet, {
    cascade: true,
  })
  transactions: Transaction[];

  @BeforeInsert()
  async setCreditCardType() {
    this.type = creditCardType(this.cardNumber).map((card) => card.type)[0];
  }
}
