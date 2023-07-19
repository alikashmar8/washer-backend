import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ServiceType } from './entities/service-type.entity';
import { ServiceTypesController } from './service-types.controller';
import { ServiceTypesService } from './service-types.service';
import { Message } from 'src/chats/entities/message.entity';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceType,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
      Chat,
      Message,
    ]),
  ],
  controllers: [ServiceTypesController],
  providers: [
    ServiceTypesService,
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
    ChatsService,
  ],
})
export class ServiceTypesModule {}
