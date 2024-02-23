import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { MailService } from 'src/common/mail/mail.service';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Employee } from './../employees/entities/employee.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Employee,
      DeviceToken,
      Setting,
      Branch,
      Chat,
      Message,
      Notification,
      ServiceRequest,
    ]),
  ],
  providers: [
    AuthService,
    UsersService,
    ChatsService,
    EmployeesService,
    DeviceTokensService,
    MailService,
    AppService,
    BranchesService,
    NotificationsService,
    GoogleStrategy,
    ConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
