import { TransactionStatus } from 'src/common/enums/transaction-status.enum';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  // @Column({
  //   type: 'enum',
  //   enum: TransactionType,
  //   nullable: false,
  // })
  // type: TransactionType;

  @Column({ nullable: true })
  walletId?: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  creditCardId?: string;

  @ManyToOne((type) => CreditCard, (card) => card.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creditCardId' })
  creditCard?: CreditCard;

  @ManyToOne((type) => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'walletId' })
  wallet?: Wallet;

  @ManyToOne((type) => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany((type) => ServiceRequest, (req) => req.transaction, {
    cascade: true,
  })
  requests: ServiceRequest[];
}
