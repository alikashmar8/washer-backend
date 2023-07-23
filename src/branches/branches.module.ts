import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';
import { Message } from 'src/chats/entities/message.entity';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Branch,
      Employee,
      DeviceToken,
      Setting,
      User,
      Chat,
      Message,
    ]),
  ],
  controllers: [BranchesController],
  providers: [
    BranchesService,
    EmployeesService,
    AppService,
    UsersService,
    ChatsService,
  ],
})
export class BranchesModule {}
