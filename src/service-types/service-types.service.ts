import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ServiceType } from './entities/service-type.entity';

@Injectable()
export class ServiceTypesService {
  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.serviceTypesRepository
      .findOneOrFail({
        where: { id },
        relations: relations,
      })
      .catch((err) => {
        throw new BadRequestException('Service Types not found!', err);
      });
  }
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypesRepository: Repository<ServiceType>,
  ) {}

  async create(data: CreateServiceTypeDto) {
    return await this.serviceTypesRepository.save(data).catch((err) => {
      throw new BadRequestException('Error creating type!', err);
    });
  }

  findAll() {
    return `This action returns all serviceTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceType`;
  }

  async update(id: string, data: UpdateServiceTypeDto) {
    return await this.serviceTypesRepository.update(id, data).catch((err) => {
      throw new BadRequestException('Error updating service type', err);
    });
  }

  async remove(id: string) {
    return await this.serviceTypesRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error removing service type!', err);
    });
  }
}
