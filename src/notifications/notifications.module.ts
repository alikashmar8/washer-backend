import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, DeviceToken, Employee])],
  controllers: [NotificationsController],
  providers: [NotificationsService, UsersService, DeviceTokensService, EmployeesService]
})
export class NotificationsModule { }
