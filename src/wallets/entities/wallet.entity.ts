import { Currency } from 'src/common/enums/currency.enum';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.LBP })
  currency: Currency;

  @OneToOne((type) => User, (user) => user.wallet, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany((type) => Transaction, (transaction) => transaction.wallet, {
    cascade: true,
  })
  transactions: Transaction[];
}
