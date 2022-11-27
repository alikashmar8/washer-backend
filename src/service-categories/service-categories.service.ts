import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryStatusDto } from './dto/update-service-category-status.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategory } from './entities/service-category.entity';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoriesRepository: Repository<ServiceCategory>,
  ) {}

  async create(data: CreateServiceCategoryDto) {    
    return await this.serviceCategoriesRepository.save(data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error adding category!');
    });
  }

  async findAll(queryParams: {
    take?: any;
    skip?: any;
    isActive?: boolean;
    search?: string;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let isFirstWhere = true;
    let query: any =
      this.serviceCategoriesRepository.createQueryBuilder('category');
    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      isFirstWhere = false;
      query = query.where('category.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }
    if (queryParams.search) {
      let innerQuery = new Brackets((qb) => {
        qb.where('category.name like :name', {
          name: `%${queryParams.search}%`,
        }).orWhere('category.icon like :name', {
          name: `%${queryParams.search}%`,
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
    return `This action returns a #${id} serviceCategory`;
  }

  async update(id: string, data: UpdateServiceCategoryDto) {
    return await this.serviceCategoriesRepository
      .update(id, data)
      .catch((err) => {
        throw new BadRequestException('Error updating category!', err);
      });
  }

  async remove(id: string) {
    // TODO: remove icon
    return await this.serviceCategoriesRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting category!', err);
    });
  }

  async updateStatus(id: string, data: UpdateServiceCategoryStatusDto) {
    return await this.serviceCategoriesRepository
      .update(id, data)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating category status');
      });
  }
  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.serviceCategoriesRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Category not found!', err);
      });
  }
}
