import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
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

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.categoriesRepository
      .findOneOrFail({ where: { id: id }, relations })
      .catch((err) => {
        throw new BadRequestException('Category not found', err);
      });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const products = await this.productsRepository.count({
      where: { categoryId: id },
    });
    if (products > 0)
      throw new BadRequestException(
        'Category has products, cannot be deleted now',
      );

    const category = await this.categoriesRepository
      .findOneByOrFail({ id })
      .catch(() => {
        throw new BadRequestException(`Category with id: ${id} was not found`);
      });
    return await this.categoriesRepository.softDelete(category.id);
  }
}
