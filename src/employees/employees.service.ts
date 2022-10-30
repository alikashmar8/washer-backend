import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  findAll() {
    return `This action returns all employees`;
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
