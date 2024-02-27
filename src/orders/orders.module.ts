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
import { Promo } from 'src/promos/entities/promo.entity';
import { PromosService } from 'src/promos/promos.service';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      DeviceToken,
      Employee,
      OrderItem,
      Product,
      Promo,
      Setting,
      Branch,
      Chat,
      Message,
      Notification,
      ServiceRequest,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    UsersService,
    EmployeesService,
    PromosService,
    AppService,
    BranchesService,
    ChatsService,
    NotificationsService,
  ],
})
export class OrdersModule {}
