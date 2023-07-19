import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { Message } from 'src/chats/entities/message.entity';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      DeviceToken,
      Setting,
      Branch,
      User,
      Chat,
      Message,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    DeviceTokensService,
    AppService,
    BranchesService,
    UsersService,
    ChatsService,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
