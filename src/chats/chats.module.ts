import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Message,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
      Notification,
      ServiceRequest,
    ]),
  ],
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ChatsGateway,
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
    NotificationsService,
  ],
})
export class ChatsModule {}
