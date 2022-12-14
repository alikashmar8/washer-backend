import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { Address } from 'src/addresses/entities/address.entity';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceTypesService } from 'src/service-types/service-types.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { ServiceType } from './../service-types/entities/service-type.entity';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      ServiceType,
      Branch,
      Address,
      User,
      DeviceToken,
      Employee,
      Vehicle,
      Setting,
    ]),
  ],
  controllers: [ServiceRequestsController],
  providers: [
    ServiceRequestsService,
    ServiceTypesService,
    BranchesService,
    AddressesService,
    UsersService,
    EmployeesService,
    VehiclesService,
    SettingsService,
  ],
})
export class ServiceRequestsModule {}
