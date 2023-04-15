import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as fs from 'fs';
import { Currency } from 'src/common/enums/currency.enum';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager
        .getRepository(Product)
        .save(createProductDto);

      let savedImages = [];
      createProductDto.images.forEach(async (image) => {
        const productImage = await queryRunner.manager
          .getRepository(ProductImage)
          .save({
            image: image,
            productId: product.id,
          });
        savedImages.push(productImage);
      });

      product.images = savedImages;

      // TODO: remove next line -probably not needed-
      await queryRunner.manager.getRepository(Product).save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Error creating product');
    }
  }

  /*
    async create(createProductDto: CreateProductDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const createdProduct = await queryRunner.manager
                .getRepository(Product)
                .save(createProductDto);


            createProductDto.images.forEach(image => {
                queryRunner.manager
                    .getRepository(ProductImage)
                    .save({ productId: createdProduct.id, image });
            })

            await queryRunner.commitTransaction();
            await queryRunner.release();
            return createdProduct;
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new BadRequestException('Error creating product');
        }
    }
*/

  async findAll(queryParams: {
    search?: string;
    isActive?: boolean;
    take?: number;
    skip?: number;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id IS NOT NULL');

    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      query = query.andWhere('product.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }

    if (queryParams.search) {
      query = query.andWhere('product.name LIKE :search', {
        search: '%' + queryParams.search + '%',
      });
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {    
    return await this.productRepository
      .update(id, updateProductDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating address!');
      });
  }

  async updateProductView(id: string) {
    const product = await this.findOneByIdOrFail(id);
    product.views++;
    return await this.productRepository.save(product);
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.productRepository
      .findOneOrFail({ where: { id: id }, relations: relations })
      .catch((err) => {
        throw new BadRequestException('Product not found!', err);
      });
  }

  async remove(id: string) {
    return await this.productRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting product');
    });
  }

  async deleteImage(id: string, imagePath: string) {
    const product = await this.findOneByIdOrFail(id);
    if (!product) {
      throw new NotFoundException('Employee not found');
    }
    if (product.images) {
      try {
        if (fs.existsSync(imagePath)) {
          // file exists, delete it
          console.log('Checked imagePath');
          fs.unlinkSync(imagePath);
        } else {
          console.log(`File does not exist: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image file: ${err.message}`);
      }
    }
  }
}
