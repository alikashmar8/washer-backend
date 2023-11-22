import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { BranchesService } from './branches/branches.service';
import {
  CAR_COST,
  EXCHANGE_RATE,
  MOTORCYCLE_COST,
  POINTS_PER_ORDER_PERCENTAGE,
  RANGE_COST,
  TRUCK_COST,
  VAN_COST,
} from './common/constants';
import { Currency } from './common/enums/currency.enum';
import { EmployeeRole } from './common/enums/employee-role.enum';
import { PaymentType } from './common/enums/payment-type.enum';
import { Setting } from './settings/entities/setting.entity';

import { Chat } from './chats/entities/chat.entity';
import { Employee } from './employees/entities/employee.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  createMessage(payload: Chat) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private branchesService: BranchesService,
    private usersService: UsersService,
    @InjectRepository(Setting) private settingsRepository: Repository<Setting>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async initData(): Promise<void | PromiseLike<void>> {
    const employee = this.employeesRepository.create({
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'P@ssw0rd',
      role: EmployeeRole.ADMIN,
      username: 'admin',
      email: 'admin@revojok.com',
      branchId: null,
      phoneNumber: '12345678',
    });
    await this.employeesRepository.save(employee).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating employee!');
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
    });

    await this.branchesService.create({
      description: 'Beirut branch 1',
      isActive: true,
      coverageArea: 2000,
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
        value: '100000',
      },
      {
        key: CAR_COST,
        value: '10',
      },
      {
        key: VAN_COST,
        value: '20',
      },
      {
        key: RANGE_COST,
        value: '15',
      },
      {
        key: TRUCK_COST,
        value: '30',
      },
      {
        key: MOTORCYCLE_COST,
        value: '5',
      },
      {
        key: POINTS_PER_ORDER_PERCENTAGE,
        value: '1',
      },
    ]);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getAllConstants() {
    return {
      PAYMENT_METHODS: [PaymentType.CASH, PaymentType.WALLET],
    };
  }

  async deleteFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        // file exists, delete it

        fs.unlinkSync(filePath);
        console.log('Image File deleted');
      } else {
        console.log(`File does not exist: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error deleting image file: ${err.message}`);
    }
  }

  async updateFile(
    id: string,
    filePropertyName: string,
    newFilePath: string,
    repository: Repository<any>,
  ) {
    const entity = await repository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    const oldFile = entity[filePropertyName];

    await repository.update(id, { [filePropertyName]: newFilePath });

    if (oldFile) {
      const oldFilePath = path.join(process.cwd(), oldFile);
      try {
        await this.deleteFile(oldFilePath);
      } catch (err) {
        console.error(
          `Failed to delete old ${filePropertyName} file ${oldFile}: ${err}`,
        );
      }
    }
  }
}
