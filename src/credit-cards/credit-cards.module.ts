import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditCard,
      User,
      DeviceToken,
      Chat,
      Message,
      Notification,
    ]),
  ],
  controllers: [CreditCardsController],
  providers: [
    CreditCardsService,
    UsersService,
    ChatsService,
    NotificationsService,
  ],
})
export class CreditCardsModule {}
