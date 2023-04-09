import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Category,Employee,DeviceToken,User])],
  controllers: [CategoriesController],
  providers: [CategoriesService,EmployeesService,UsersService]
})
export class CategoriesModule {}
