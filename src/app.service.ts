import { Injectable } from '@nestjs/common';
import { BranchesService } from './branches/branches.service';
import { EmployeeRole } from './common/enums/employee-role.enum';
import { EmployeesService } from './employees/employees.service';

@Injectable()
export class AppService {
  constructor(
    private branchesService: BranchesService,
    private employeesService: EmployeesService,
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
        isDefault: true,
        lat: 33.8938,
        long: 35.5018,
      },
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
