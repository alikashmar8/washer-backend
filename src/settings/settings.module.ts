import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeviceToken } from './../device-tokens/entities/device-token.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Setting,
      User,
      DeviceToken,
      Employee,
      Branch,
      Chat,
      Message,
      Notification,
    ]),
  ],
  controllers: [SettingsController],
  providers: [
    SettingsService,
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
    ChatsService,
    NotificationsService,
  ],
})
export class SettingsModule {}
