import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DeviceToken, Employee, Setting, Branch])],
  controllers: [UsersController],
  providers: [UsersService, EmployeesService, AppService, BranchesService],
})
export class UsersModule {}
