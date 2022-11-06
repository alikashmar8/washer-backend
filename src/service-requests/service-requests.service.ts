import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { calculateDistance } from 'src/common/utils/functions';
import { Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequest } from './entities/service-request.entity';

@Injectable()
export class ServiceRequestsService {
  
  constructor(
    private branchesService: BranchesService,
    @InjectRepository(ServiceRequest)
    private requestsRepository: Repository<ServiceRequest>,
  ) {}

  async create(data: CreateServiceRequestDto) {
    //TODO: enhance branch choosing
    const res = await this.branchesService.findAll(null, ['address']);
    const branches = res.data;
    let branch: any = {};
    branch.distance = 99999999;

    branches.forEach((b) => {
      let dist = calculateDistance(
        {
          lat: data.lat,
          long: data.long,
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

  async findAll(filters: {
    userId?: string;
    employeeId?: string;
    branchId?: string;
    take?: number;
    skip?: number;
  }) {
    const take = filters.take || 10;
    const skip = filters.skip || 0;
    let isFirstWhere: boolean = true;

    let query: any = this.requestsRepository.createQueryBuilder('req');

    if (filters.userId) {
      if (isFirstWhere)
        query = query.where('req.userId = :uId', { uId: filters.userId });
      else query = query.andWhere('req.userId = :uId', { uId: filters.userId });
      isFirstWhere = false;
    }

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

    if (filters.employeeId) {
      if (isFirstWhere)
        query = query.where('req.branchId = :bId', { bId: filters.branchId });
      else
        query = query.andWhere('req.branchId = :bId', {
          bId: filters.branchId,
        });
      isFirstWhere = false;
    }

    query = await query.skip(skip).take(take).getManyAndCount();
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
