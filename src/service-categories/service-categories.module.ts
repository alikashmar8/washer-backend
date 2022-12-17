import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesService } from './service-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, User, DeviceToken, Employee])],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService, UsersService, EmployeesService],
})
export class ServiceCategoriesModule {}
