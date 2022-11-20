import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Brackets, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}
  async findById(id: string, relations?: string[]) {
    return await this.employeesRepository.findOne({
      where: {
        id: id,
      },
      relations,
    });
  }

  async findByIdOrFail(id: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: {
          id: id,
        },
        relations,
      })
      .catch(() => {
        throw new BadRequestException('Error employee not found!');
      });
  }
  async findByPhoneNumberOrFail(phoneNumber: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { phoneNumber: phoneNumber },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with phone number: ${phoneNumber} was not found`,
        );
      });
  }
  async findByUsernameOrFail(username: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { username },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with username: ${username} was not found`,
        );
      });
  }
  async findByEmailOrFail(email: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { email: email },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with email: ${email} was not found`,
        );
      });
  }
  async create(data: CreateEmployeeDto) {
    let employee = this.employeesRepository.create(data);
    return await this.employeesRepository.save(employee).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating employee!');
    });
  }

  async findAll(
    queryParams: {
      search?: string;
      branchId?: string;
      role?: EmployeeRole;
      isActive?: boolean;
      take?: number;
      skip?: number;
    },
    currentEmployee: Employee,
  ) {
    if (currentEmployee.role == EmployeeRole.DRIVER)
      throw new BadRequestException(
        'You are not allowed to perform this action!',
      );

    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let isFirstWhere = true;

    let query: any = this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.branch', 'branch');
    if (currentEmployee.role == EmployeeRole.BRANCH_EMPLOYEE) {
      if (isFirstWhere) isFirstWhere = false;
      query = query.where('employee.branchId :bId', {
        bId: currentEmployee.branchId,
      });
    }

    if (queryParams.branchId) {
      let queryString = 'employee.branchId = ' + queryParams.branchId;
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(queryString);
      } else {
        query = query.andWhere(queryString);
      }
    }

    if (queryParams.role) {
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where('employee.role = :role ', {
          role: queryParams.role,
        });
      } else {
        query = query.andWhere('employee.role = :role ', {
          role: queryParams.role,
        });
      }
    }

    if (queryParams.isActive == true || queryParams.isActive == false) {
      let queryString = 'employee.isActive = ' + queryParams.isActive;
    }
    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where('employee.isActive = :isActive', {
          isActive: queryParams.isActive,
        });
      } else {
        query = query.andWhere('employee.isActive = :isActive', {
          isActive: queryParams.isActive,
        });
      }
    }

    if (queryParams.search) {
      let innerQuery = new Brackets((qb) => {
        qb.where('employee.firstName like :name', {
          name: `%${queryParams.search}%`,
        })
          .orWhere('employee.lastName like :name', {
            name: `%${queryParams.search}%`,
          })
          .orWhere('employee.username like :username', {
            username: `%${queryParams.search}%`,
          })
          .orWhere('employee.email like :email', {
            email: `%${queryParams.search}%`,
          })
          .orWhere('employee.phoneNumber like :mobile', {
            mobile: `%${queryParams.search}%`,
          });
      });
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(innerQuery);
      } else {
        query = query.andWhere(innerQuery);
      }
    }
    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(id: string) {
    return await this.employeesRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error unable to delete employee!');
    });
  }
}
