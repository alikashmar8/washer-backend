import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';
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

    ) { }

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


    async remove(id: number) {
        return await this.productRepository.delete({ id }).catch((err) => {
            console.log(err);
            throw new BadRequestException('Error deleting product');
        });
    }

}
