import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { calculateDistance } from 'src/common/utils/functions';
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
    private branchesService: BranchesService,
  ) {}

  async create(createAddressDto: CreateUserAddressDto) {
    // Validate if the user's address is within any branch's coverage area
    const res = await this.branchesService.findAll({}, ['address']); // Replace with your actual method to fetch branches
    const branches = res.data;
    const userLat = createAddressDto.lat;
    const userLon = createAddressDto.lon;

    let nearestBranch: Branch;
    let nearestDistance: number = Number.MAX_VALUE;
    for (const branch of branches) {
      const branchLat = branch.address.lat;
      const branchLon = branch.address.lon;

      const distance = calculateDistance(
        { lat: userLat, lon: userLon },
        { lat: branchLat, lon: branchLon },
      );

      if (distance < nearestDistance) {
        nearestBranch = branch;
        nearestDistance = distance;
      }
    }

    if (
      nearestDistance == Number.MAX_VALUE ||
      !nearestBranch ||
      nearestBranch.coverageArea < nearestDistance
    )
      throw new BadRequestException(
        'No close branch was found near your address!',
      );

    return await this.addressesRepository.save(createAddressDto);
  }

  async findAll(queryParams: { userId?: string }) {
    let query = this.addressesRepository.createQueryBuilder('address');

    if (queryParams.userId) {
      query = query.where('address.userId = :uid', { uid: queryParams.userId });
    }

    return await query.getMany();
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
    return await this.addressesRepository
      .softDelete(address.id)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(
          'Error unable to delete this address!',
          err,
        );
      });
  }
}
