import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard, User, DeviceToken])],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, UsersService],
})
export class CreditCardsModule {}
