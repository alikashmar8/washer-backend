import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ServiceType } from './entities/service-type.entity';
import { ServiceTypesController } from './service-types.controller';
import { ServiceTypesService } from './service-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceType,
      User,
      DeviceToken,
      Employee,
      Setting,
    ]),
  ],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService, UsersService, EmployeesService],
})
export class ServiceTypesModule {}
