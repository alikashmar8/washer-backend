import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';
import { ChatsService } from 'src/chats/chats.service';
import { Message } from 'src/chats/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditCard, User, DeviceToken, Chat, Message]),
  ],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, UsersService, ChatsService],
})
export class CreditCardsModule {}
