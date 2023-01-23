import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        return await this.ordersRepository.save(createOrderDto).catch((err) => {
            console.log(err);
            throw new BadRequestException('Error creating Order!');
        });
    }

    async findAll(queryParams: { userId?: string }) {
        let query = this.ordersRepository.createQueryBuilder('order');

        if (queryParams.userId) {
            query = query.where('order.userId = :uid', { uid: queryParams.userId });
        }

        return await query.getMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} order`;
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    remove(id: number) {
        return `This action removes a #${id} order`;
    }
}
