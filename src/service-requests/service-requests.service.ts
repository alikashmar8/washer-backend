import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { BranchesService } from 'src/branches/branches.service';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { calculateDistance } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequest } from './entities/service-request.entity';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private branchesService: BranchesService,
    private addressesService: AddressesService,
    @InjectRepository(ServiceRequest)
    private requestsRepository: Repository<ServiceRequest>,
  ) {}

  async create(data: CreateServiceRequestDto) {
    //TODO: enhance branch choosing
    const res = await this.branchesService.findAll(null, ['address']);
    const branches = res.data;
    let branch: any = {};
    branch.distance = 99999999;

    const requestAddress = await this.addressesService.findByIdOrFail(
      data.addressId,
    );

    branches.forEach((b) => {
      let dist = calculateDistance(
        {
          lat: requestAddress.lat,
          long: requestAddress.long,
        },
        {
          lat: b.address.lat,
          long: b.address.long,
        },
      );

      if (dist < branch.distance) {
        branch = b;
        branch.distance = dist;
      }
    });

    if (branch.distance == 99999999)
      throw new BadRequestException('No branch was found close to you!');

    data.branchId = branch.id;

    let request = this.requestsRepository.create(data);

    return await this.requestsRepository.save(request).catch((err) => {
      console.log('Error creating request:');
      console.log(err);
      throw new BadRequestException(request);
    });
  }

  async findAll(
    filters: {
      userId?: string;
      employeeId?: string;
      branchId?: string;
      take?: number;
      skip?: number;
    },
    currentEmployee: Employee,
    currentUser: User,
  ) {
    const take = filters.take || 10;
    const skip = filters.skip || 0;
    let isFirstWhere: boolean = true;

    let query: any = this.requestsRepository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.user', 'user')
      .leftJoinAndSelect('req.type', 'type')
      .leftJoinAndSelect('type.category', 'category');

    if (filters.userId || currentUser) {
      let uid = filters.userId;
      if (currentUser) uid = currentUser.id;
      if (isFirstWhere) query = query.where('req.userId = :uId', { uId: uid });
      else query = query.andWhere('req.userId = :uId', { uId: uid });
      isFirstWhere = false;
    }

    if (filters.branchId) {
      if (isFirstWhere)
        query = query.where('req.branchId = :bId', { bId: filters.branchId });
      else
        query = query.andWhere('req.branchId = :bId', {
          bId: filters.branchId,
        });
      isFirstWhere = false;
    }

    if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
      // if employee is driver => he will be able to see his requests or non assigned ones
      let innerQuery = new Brackets((qb) => {
        qb.where('req.employeeId = :eid', {
          eid: currentEmployee.id,
        }).orWhere('req.employeeId is null');
        // .orWhere('req.employeeId = :eid', {
        //   eid: null,
        // });
      });
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(innerQuery);
      } else {
        query = query.andWhere(innerQuery);
      }
    } else {
      // filter by employee normally
      if (filters.employeeId) {
        if (isFirstWhere)
          query = query.where('req.employeeId = :eId', {
            eId: filters.employeeId,
          });
        else
          query = query.andWhere('req.employeeId = :eId', {
            eId: filters.employeeId,
          });
        isFirstWhere = false;
      }
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
      query[0].forEach(function (element, index) {
        let dist = calculateDistance(
          {
            lat: query.lat,
            long: query.long,
          },
          {
            lat: element.address.lat,
            long: element.address.long,
          },
        );

        if (dist <= 3000) {
          query[0].splice(index, 1);
        }
      });
    }
    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.requestsRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Service request not found!');
      });
  }

  update(id: number, updateServiceRequestDto: UpdateServiceRequestDto) {
    return `This action updates a #${id} serviceRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceRequest`;
  }

  async updateStatus(id: string, data: UpdateServiceRequestStatusDto) {
    return await this.requestsRepository.update(id, data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating status');
    });
  }
}
