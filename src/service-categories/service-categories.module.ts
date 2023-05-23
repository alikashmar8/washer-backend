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
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesService } from './service-categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCategory,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
    ]),
  ],
  controllers: [ServiceCategoriesController],
  providers: [
    ServiceCategoriesService,
    UsersService,
    EmployeesService,
    AppService,
    BranchesService,
  ],
})
export class ServiceCategoriesModule {}
