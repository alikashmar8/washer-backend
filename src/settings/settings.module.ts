import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeviceToken } from './../device-tokens/entities/device-token.entity';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, User, DeviceToken, Employee])],
  controllers: [SettingsController],
  providers: [SettingsService, UsersService, EmployeesService],
})
export class SettingsModule {}
