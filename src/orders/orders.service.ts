import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PromosService } from 'src/promos/promos.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private promoService: PromosService,
        private dataSource: DataSource
    ) { }

    async create(createOrderDto: CreateOrderDto) {

        let items = createOrderDto.orderItems;
        createOrderDto.orderItems = null;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const order = await this.ordersRepository.save(createOrderDto).catch((err) => {
                console.log(err);
                throw new BadRequestException('Error saving Order  !');
            });

            items = await Promise.all(
                items.map(async (item) => {
                    item.orderId = order.id;
                    const product = await this.productsRepository.findOneOrFail({ where: { id: item.productId } });
                    item.price = product.price;
                    return item;
                })
            );


            const { total, discountAmount }
                = await this.calculateTotal(createOrderDto, items);
            order.total = total;

            if (discountAmount)
                order.discountAmount = discountAmount;

            if (createOrderDto.promoCode)
                order.promoCode = createOrderDto.promoCode


            await this.orderItemsRepository.save(items).catch((err) => {
                console.log(err);
                throw new BadRequestException('Error saving items !');
            });

            await this.ordersRepository.update({ id: order.id }, { total: total }).catch((err) => {
                console.log(err);
                throw new BadRequestException('Error Order Creation  !');
            });
            await queryRunner.commitTransaction();
            return order;
        } catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Error creating order!');
        } finally {
            await queryRunner.release();
        }

    }

    async findAll(queryParams: { userId?: string }) {
        let query = this.ordersRepository.createQueryBuilder('order');

        if (queryParams.userId) {
            query = query.where('order.userId = :uid', { uid: queryParams.userId });
        }

        return await query.getMany();
    }

    async findOne(id: number) {
        return await this.ordersRepository.findOne({
            where: { id },
        }).catch((err) => {
            throw new BadRequestException('Order not found!', err);
        });
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    async remove(id: number) {
        return await this.ordersRepository.delete(id).catch(() => {
            throw new BadRequestException('Error deleting order');
        });
    }

    async calculateTotal(orderData: CreateOrderDto, orderItems: OrderItem[]): Promise<{ total: number, discountAmount: number }> {
        let total = 0;

        orderItems.forEach((item) => {
            total += item.price * item.quantity;
        });

        let discountAmount = 0;
        let promoIsValid = false;
        const promo = await this.promoService.findPromo(orderData.promoCode);

        promoIsValid = await this.promoService.checkValidity(orderData.userId, orderData.promoCode);

        if (promoIsValid && promo.discountPercentage) {
            discountAmount = total * promo.discountPercentage / 100;
            this.promoService.consumePromo(orderData.userId, orderData.promoCode);
        } else {
            if (promoIsValid && promo.discountAmount) {
                discountAmount = promo.discountAmount;
                this.promoService.consumePromo(orderData.userId, orderData.promoCode);
            }
        }

        total -= discountAmount;
        return { total, discountAmount };
    }
}
