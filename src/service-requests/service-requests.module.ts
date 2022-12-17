import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { Address } from 'src/addresses/entities/address.entity';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      Branch,
      Address,
      User,
      DeviceToken,
      Employee
    ]),
  ],
  controllers: [ServiceRequestsController],
  providers: [
    ServiceRequestsService,
    BranchesService,
    AddressesService,
    UsersService,
    EmployeesService,
  ],
})
export class ServiceRequestsModule {}
