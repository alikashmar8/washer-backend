import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AppService } from './../app.service';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ad } from './entities/ad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ad,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
    ]),
  ],
  controllers: [AdsController],
  providers: [
    AdsService,
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
  ],
})
export class AdsModule {}
