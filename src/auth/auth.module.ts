import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { MailService } from 'src/common/mail/mail.service';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Employee } from './../employees/entities/employee.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee, DeviceToken, Setting, Branch]),
  ],
  providers: [
    AuthService,
    UsersService,
    EmployeesService,
    DeviceTokensService,
    MailService,
    AppService,
    BranchesService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
