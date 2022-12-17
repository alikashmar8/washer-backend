import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ad } from './entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ad, User, DeviceToken, Employee])],
  controllers: [AdsController],
  providers: [AdsService, UsersService, EmployeesService],
})
export class AdsModule {}
