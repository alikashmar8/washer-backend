import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ImageFileService } from './imageFile.service';
import * as path from 'path';
import { Currency } from 'src/common/enums/currency.enum';
import * as fs from 'fs';


@Injectable()
export class ProductsService {
  private readonly productImagesPath = path.join(
    __dirname,
    '..',
    'public',
    'uploads',
    'products',
  );

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private imageFileService: ImageFileService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('1');
    try {
      const product = new Product();
      product.title = createProductDto.title;
      product.description = createProductDto.description;
      product.price = createProductDto.price;
      product.currency = createProductDto.currency || Currency.LBP;
      // product.category = createProductDto.category;
      product.views = 0;
      const createdProduct = await queryRunner.manager
        .getRepository(Product)
        .save(product);
      console.log('2');
      const savedImages = await Promise.all(
        createProductDto.images.map(async (image) => {
          const savedImage = await this.imageFileService.saveImage(image);
          const productImage = new ProductImage();
          productImage.productId = createdProduct.id;
          productImage.image =
            this.productImagesPath + '/' + savedImage.filename;
          console.log('3');
          await queryRunner.manager
            .getRepository(ProductImage)
            .save(productImage);
          return productImage;
        }),
      );

      createdProduct.images = savedImages;
      console.log('4');
      await queryRunner.commitTransaction();
      await queryRunner.release();
      console.log('5');
      return createdProduct;
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

  async findAll(relations?: string[]) {
    return await this.productRepository.find({
      relations: relations,
    });
  }

  async findOne(id: number, relations?: string[]) {
    return await this.productRepository
      .findOneOrFail({
        where: [{ id: id }],
        relations: relations,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Product not found');
      });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productRepository
      .update(id, updateProductDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating address!');
      });
  }

  async updateProductView(id: number) {
    const product = await this.productRepository
      .findOneOrFail({
        where: { id },
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException("Can't find product !");
      });

    product.views++;

    return await this.productRepository.save(product);
  }

  async findOneByIdOrFail(id: number) {
    return await this.productRepository.findOneByOrFail({id}).catch((err) => {
      throw new BadRequestException('Product not found!', err);
    });
  }

  async remove(id: string) {
    return await this.productRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting product');
    });
  }

  async deleteImage(id: number, imagePath: string) {
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
