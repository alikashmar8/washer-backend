import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeviceToken } from './../device-tokens/entities/device-token.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ChatsService } from 'src/chats/chats.service';
import { Message } from 'src/chats/entities/message.entity';

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
  ],
})
export class SettingsModule {}
