import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Promo } from './entities/promo.entity';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promo,
      Employee,
      DeviceToken,
      Setting,
      Branch,
      User,
    ]),
  ],
  controllers: [PromosController],
  providers: [
    PromosService,
    EmployeesService,
    AppService,
    BranchesService,
    UsersService,
  ],
})
export class PromosModule {}
