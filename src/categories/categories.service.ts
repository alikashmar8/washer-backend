import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating category!');
    });
  }

  async findAll(queryParams: {
    search?: string;
    isActive?: boolean;
    take?: number;
    skip?: number;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.id IS NOT NULL');

    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      query = query.andWhere('category.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }

    if (queryParams.search) {
      query = query.andWhere('category.name LIKE :search', {
        search: '%' + queryParams.search + '%',
      });
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new BadRequestException(`Category with id: ${id} was not found`);
      });
    category.name = updateCategoryDto.name;
    category.isActive = updateCategoryDto.isActive;
    await this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoriesRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new BadRequestException(`Category with id: ${id} was not found`);
      });
    return await this.categoriesRepository.remove(category);
  }
}
