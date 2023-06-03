import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import { Address } from 'src/addresses/entities/address.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Promo } from 'src/promos/entities/promo.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import {
  generateUniqueCode,
  removeSpecialCharacters,
} from '../../common/utils/functions';
import { CreditCard } from './../../credit-cards/entities/credit-card.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  appleId?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationDate: Date;

  @Column({ default: false })
  isMobileVerified: boolean;

  @Column({ nullable: true })
  mobileVerificationDate: Date;

  @Column({ type: 'integer', default: 0 })
  points: number;

  @Column({ type: 'text', nullable: true })
  referralCode?: string;

  @Exclude()
  @Column({ nullable: true })
  mobileVerificationCode?: string;

  @Exclude()
  @Column({ nullable: true })
  mobileVerificationCodeExpiry?: Date;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationCode?: string;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationCodeExpiry?: Date;

  @Exclude()
  @Column({ nullable: true })
  passwordResetCode?: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetExpiry?: Date;

  @Column({ nullable: false })
  walletId: string;

  @OneToMany((type) => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany((type) => Vehicle, (v) => v.user, { cascade: true })
  public vehicles: Vehicle[];

  @OneToOne((type) => Wallet, (wallet) => wallet.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Exclude()
  @OneToMany((type) => Promo, (promo) => promo.user, { cascade: true })
  promos: Promo[];

  @OneToMany((type) => DeviceToken, (deviceToken) => deviceToken.user, {
    cascade: true,
  })
  deviceTokens: DeviceToken[];

  @OneToMany((type) => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Exclude()
  @OneToMany((type) => CreditCard, (card) => card.user, { cascade: true })
  creditCards: CreditCard[];

  @OneToMany((type) => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @Exclude()
  @OneToMany((type) => Transaction, (transaction) => transaction.user, {
    cascade: true,
  })
  transactions: Transaction[];

  @Exclude()
  @OneToMany((type) => ServiceRequest, (req) => req.user, {
    cascade: true,
  })
  requests: ServiceRequest[];

  @Exclude()
  @OneToMany((type) => Message, (message) => message.user)
  messages: Message[];

  @Exclude()
  @OneToMany((type) => Chat, (chat) => chat.user)
  chats: Chat[];

  public get isSocialMediaLogin(): boolean {
    return (
      this.facebookId != null || this.googleId != null || this.appleId != null
    );
  }

  @BeforeInsert()
  async hashPassword() {
    this.username = this.username
      ? this.username
      : removeSpecialCharacters(this.firstName + this.lastName) + Date.now();
    this.password = this.password
      ? removeSpecialCharacters(this.phoneNumber)
      : null;
    const password = this.password ? this.password : this.username;
    const hash = await argon.hash(password);
    this.password = hash;
    this.email = this.email ? this.email.toLowerCase() : null;
    this.referralCode = generateUniqueCode();
  }
}
