import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    UsersService,
    EmployeesService,
    DeviceTokensService,
    AppService,
    BranchesService,
  ],
})
export class NotificationsModule {}
