import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
      Chat,
      Message,
      Notification,
      ServiceRequest,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
    ChatsService,
    NotificationsService,
  ],
})
export class UsersModule {}
