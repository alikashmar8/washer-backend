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
import { Product } from 'src/products/entities/product.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Employee,
      DeviceToken,
      User,
      Setting,
      Branch,
      Chat,
      Message,
      Notification,
      Product,
      ServiceRequest,
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    EmployeesService,
    UsersService,
    AppService,
    BranchesService,
    ChatsService,
    NotificationsService,
  ],
})
export class CategoriesModule {}
