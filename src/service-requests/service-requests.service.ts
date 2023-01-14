import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { BranchesService } from 'src/branches/branches.service';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { calculateDistance } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { ServiceTypesService } from 'src/service-types/service-types.service';
import { SettingsService } from 'src/settings/settings.service';
import { User } from 'src/users/entities/user.entity';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Brackets, Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequest } from './entities/service-request.entity';
import { UpdateServiceRequestPaymentStatusDto } from './dto/update-service-request-payment-status.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private branchesService: BranchesService,
    private addressesService: AddressesService,
    private vehiclesService: VehiclesService,
    private serviceTypesService: ServiceTypesService,
    private settingsService: SettingsService,
    @InjectRepository(ServiceRequest)
    private requestsRepository: Repository<ServiceRequest>,
  ) { }

  async create(data: CreateServiceRequestDto) {
    //TODO: enhance branch choosing
    const res = await this.branchesService.findAll(null, ['address']);
    const branches = res.data;
    let branch: any = {};
    const initialDistance = 99999999;
    branch.distance = initialDistance;

    const requestAddress = await this.addressesService.findByIdOrFail(
      data.addressId,
    );

    branches.forEach((b) => {
      let dist = calculateDistance(
        {
          lat: requestAddress.lat,
          lon: requestAddress.lon,
        },
        {
          lat: b.address.lat,
          lon: b.address.lon,
        },
      );

      if (dist < branch.distance) {
        branch = b;
        branch.distance = dist;
      }
    });

    if (branch.distance == initialDistance)
      throw new BadRequestException('No branch was found close to you!');

    data.branchId = branch.id;

    const totalCost: number = await this.calculateRequestCost({
      serviceTypeId: data.typeId,
      tips: data.tips,
      vehicleId: data.vehicleId,
    });

    data.cost = totalCost;

    let request = this.requestsRepository.create(data);

    return await this.requestsRepository.save(request).catch((err) => {
      console.log('Error creating request:');
      console.log(err);
      throw new BadRequestException(request);
    });
  }

  async findAll(
    filters: {
      search?: string;
      userId?: string;
      employeeId?: string;
      branchId?: string;
      fromDate?: string;
      toDate?: string;
      status?: RequestStatus;
      isPaid?: boolean;
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
      .leftJoinAndSelect('req.employee', 'employee')
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

    if (filters.status) {
      if (isFirstWhere)
        query = query.where('req.status = :status', { status: filters.status });
      else
        query = query.andWhere('req.status = :status', {
          status: filters.status,
        });
      isFirstWhere = false;
    }

    if (filters.isPaid != null) {
      if (typeof filters.isPaid == 'string') {
        if (filters.isPaid == 'true') {
          filters.isPaid = true;
        } else if (filters.isPaid == 'false') {
          filters.isPaid = false;
        }
      }

      if (isFirstWhere)
        query = query.where('req.isPaid = :isPaid', {
          isPaid: filters.isPaid,
        });
      else
        query = query.andWhere('req.isPaid = :isPaid', {
          isPaid: filters.isPaid,
        });
      isFirstWhere = false;
    }

    if (filters.fromDate) {
      let startDate = new Date(filters.fromDate);
      startDate.setHours(0, 0, 0, 0);

      let innerQuery = new Brackets((qb) => {
        qb.where('req.requestedDate >= :fromDate', {
          fromDate: startDate,
        })
          .orWhere('req.confirmedDate >= :fromDate', {
            fromDate: startDate,
          })
          .orWhere('req.createdAt >= :fromDate', {
            fromDate: startDate,
          });
      });
      if (isFirstWhere) query = query.where(innerQuery);
      else query = query.andWhere(innerQuery);
      isFirstWhere = false;
    }

    if (filters.toDate) {
      let endDate = new Date(filters.toDate);
      endDate.setHours(23, 59, 59, 999);
      let innerQuery = new Brackets((qb) => {
        qb.where('req.requestedDate <= :toDate', {
          toDate: endDate,
        })
          .orWhere('req.confirmedDate <= :toDate', {
            toDate: endDate,
          })
          .orWhere('req.createdAt <= :toDate', {
            toDate: endDate,
          });
      });
      if (isFirstWhere) query = query.where(innerQuery);
      else query = query.andWhere(innerQuery);
      isFirstWhere = false;
    }

    if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
      // if employee is driver => he will be able to see his requests or non assigned ones
      // TODO: query to be tested
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

    if (filters.search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName like :name', { name: `%${filters.search}%` })
            .orWhere('user.lastName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('employee.firstName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('employee.lastName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('req.id like :id', { id: `%${filters.search}%` });
        }),
      );
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    // TODO: to be uncommented later on
    // if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
    //   query[0].forEach(function (element, index) {
    //     if (element.employeeId != currentEmployee.id){
    //       // => request is not for current driver
    //       let dist = calculateDistance(
    //         {
    //           lat: currentEmployee.lat,
    //           lon: currentEmployee.lon,
    //         },
    //         {
    //           lat: element.address.lat,
    //           lon: element.address.lon,
    //         },
    //       );

    //       if (dist <= 3000) {
    //         query[0].splice(index, 1);
    //       }
    //     }
    //   });
    // }
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

  async calculateRequestCost(data: {
    serviceTypeId: string;
    vehicleId?: string;
    tips: number;
  }): Promise<number> {
    let total: number = 0;
    const serviceType = await this.serviceTypesService.findOneByIdOrFail(
      data.serviceTypeId,
    );
    total += serviceType.price;

    if (data.vehicleId) {
      const vehicle = await this.vehiclesService.findOneByIdOrFail(
        data.vehicleId,
      );
      let key = vehicle.type + '_COST';
      let setting = await this.settingsService.findByKey(key);
      if (setting && setting.value != null) {
        total += Number(setting.value);
      }
    }

    total += data.tips;

    // todo: check for fees or other costs in case of payment by credit cards
    return total;
  }

  async updatePaymentStatus(id: string, data: UpdateServiceRequestPaymentStatusDto) {
    return await this.requestsRepository.update(id, data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating payment status');
    });
  }
}
