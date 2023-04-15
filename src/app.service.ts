import { Injectable } from '@nestjs/common';
import { BranchesService } from './branches/branches.service';
import { EmployeeRole } from './common/enums/employee-role.enum';
import { EmployeesService } from './employees/employees.service';
import { PaymentType } from './common/enums/payment-type.enum';
import { Setting } from './settings/entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CAR_COST, EXCHANGE_RATE, RANGE_COST, VAN_COST, TRUCK_COST, MOTORCYCLE_COST } from './common/constants';
import * as fs from 'fs';
import { UsersService } from './users/users.service';
import { Currency } from './common/enums/currency.enum';

@Injectable()
export class AppService {
  constructor(
    private branchesService: BranchesService,
    private employeesService: EmployeesService,
    private usersService: UsersService,
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

    await this.usersService.create({
      firstName: 'First',
      lastName: 'Customer',
      password: 'P@ssw0rd',
      username: 'firstCustomer',
      email: 'firstcustomer@revojok.com',
      phoneNumber: '96178914474',
      wallet: {
        balance: 0,
        currency: Currency.LBP,
      },
    })

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

  
  async deleteFile(filePath: string) {
      try {
        if (fs.existsSync(filePath)) {
          // file exists, delete it
          console.log('Checked filePath');
          fs.unlinkSync(filePath);
        } else {
          console.log(`File does not exist: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image file: ${err.message}`);
      }
    }


}
