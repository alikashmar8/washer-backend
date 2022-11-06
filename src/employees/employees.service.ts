import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Repository } from 'typeorm';
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

  async findAll(queryParams: any, currentEmployee: Employee) {
    if (currentEmployee.role == EmployeeRole.DRIVER)
      throw new BadRequestException(
        'You are not allowed to perform this action!',
      );

    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.employeesRepository.createQueryBuilder('employee');
    if (currentEmployee.role == EmployeeRole.BRANCH_EMPLOYEE) {
      query = query.where('employee.branchId :bId', {
        bId: currentEmployee.branchId,
      });
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

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
