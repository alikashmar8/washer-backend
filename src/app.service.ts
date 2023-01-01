import { Injectable } from '@nestjs/common';
import { BranchesService } from './branches/branches.service';
import { EmployeeRole } from './common/enums/employee-role.enum';
import { EmployeesService } from './employees/employees.service';
import { PaymentType } from './common/enums/payment-type.enum';
import { Setting } from './settings/entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CAR_COST, EXCHANGE_RATE, RANGE_COST, VAN_COST, TRUCK_COST, MOTORCYCLE_COST } from './common/constants';

@Injectable()
export class AppService {
  constructor(
    private branchesService: BranchesService,
    private employeesService: EmployeesService,
    @InjectRepository(Setting) private settingsRepository: Repository<Setting>
  ) {}

  async initData(): Promise<void | PromiseLike<void>> {
    await this.employeesService.create({
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'P@ssw0rd',
      role: EmployeeRole.ADMIN,
      username: 'admin',
      email: 'admin@revojok.com',
      branchId: null,
      phoneNumber: '12345678',
    });

    await this.branchesService.create({
      description: 'Beirut branch 1',
      address: {
        description: 'Beirut, Lebanon',
        city: 'Building',
        building: 'Building 1',
        region: 'Al Hara',
        street: 'Street 1',
        isDefault: true,
        lat: 33.8938,
        lon: 35.5018,
      },
    });

    await this.settingsRepository.save([
      { 
        key: EXCHANGE_RATE,
        value: '40000'
      },
      { 
        key: CAR_COST,
        value: '10'
      },
      { 
        key: VAN_COST,
        value: '20'
      },
      { 
        key: RANGE_COST,
        value: '15'
      },
      { 
        key: TRUCK_COST,
        value: '30'
      },
      { 
        key: MOTORCYCLE_COST,
        value: '5'
      },
    ])
  }
  
  getHello(): string {
    return 'Hello World!';
  }

  async getAllConstants() {
    return {
      'PAYMENT_METHODS': PaymentType
    }
  }
}
