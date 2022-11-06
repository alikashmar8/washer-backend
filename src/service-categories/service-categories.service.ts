import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategory } from './entities/service-category.entity';

@Injectable()
export class ServiceCategoriesService {
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

  async findAll(queryParams: { take?: any; skip?: any; isActive?: boolean }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
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
      query = query.where('category.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
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

  remove(id: number) {
    return `This action removes a #${id} serviceCategory`;
  }
}
