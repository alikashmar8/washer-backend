import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { EmployeeRole } from './../common/enums/employee-role.enum';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  async findByIdOrFail(id: string, relations?: string[]) {
    return await this.addressesRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch(() => {
        throw new BadRequestException('Address not found');
      });
  }
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateUserAddressDto) {
    return await this.addressesRepository.save(createAddressDto);
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    return await this.addressesRepository
      .update(id, updateAddressDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating address!');
      });
  }

  async remove(id: string, currentUser: User, currentEmployee: Employee) {
    if (!currentUser && !currentEmployee)
      throw new BadRequestException('Current session not passed');
    if (
      currentEmployee &&
      ![EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE].includes(
        currentEmployee.role,
      )
    )
      throw new UnauthorizedException(
        'You are not allowed to perform this action!',
      );

    const address = await this.findByIdOrFail(id);
    if (
      currentUser &&
      address.isUserAddress &&
      address.userId != currentUser.id
    )
      throw new UnauthorizedException(
        'You are not allowed to perform this action!',
      );
    return await this.addressesRepository.delete(address.id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error unable to delete this address!', err);
    });
  }
}
