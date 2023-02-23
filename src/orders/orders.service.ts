import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PromosService } from 'src/promos/promos.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let items = createOrderDto.orderItems;
    createOrderDto.orderItems = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const order = await queryRunner.manager
        .save(Order, createOrderDto)
        .catch((err) => {
          console.log(err);
          throw new BadRequestException('Error saving Order  !');
        });

      items = await Promise.all(
        items.map(async (item) => {
          item.orderId = order.id;
          const product = await queryRunner.manager.findOneOrFail(Product, {
            where: { id: item.productId },
          });
          item.price = product.price;
          return item;
        }),
      );

      const { total, discountAmount } = await this.calculateTotal(
        createOrderDto,
        items,
        queryRunner,
      );

      let promoIsValid = false;

      promoIsValid = await this.promoService.checkValidity(
        createOrderDto.userId,
        createOrderDto.promoCode,
      );

      if (promoIsValid == true)
        this.promoService.consumePromo(
          queryRunner,
          createOrderDto.userId,
          createOrderDto.promoCode,
        );

      order.total = total;

      if (discountAmount != null) order.discountAmount = discountAmount;

      if (createOrderDto.promoCode) order.promoCode = createOrderDto.promoCode;

      await queryRunner.manager.save(OrderItem, items).catch((err) => {
        console.log(err);
        throw new BadRequestException('Error saving items !');
      });

      await queryRunner.manager
        .update(Order, { id: order.id }, { total: total })
        .catch((err) => {
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

  async findAll(queryParams: { take: number; skip: number; userId?: string }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let query = this.ordersRepository.createQueryBuilder('order');

    if (queryParams.userId) {
      query = query.where('order.userId = :uid', {
        uid: queryParams.userId,
      });
    }

    return await query.skip(skip).take(take).getManyAndCount();
  }

  async findOne(id: number) {
    return await this.ordersRepository
      .findOne({
        where: { id },
      })
      .catch((err) => {
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

  async calculateTotal(
    orderData: CreateOrderDto,
    items: OrderItem[],
    queryRunner: QueryRunner,
  ): Promise<{ total: number; discountAmount: number }> {
    let total = 0;

    items = await Promise.all(
      items.map(async (item) => {
        const product = await queryRunner.manager.findOneOrFail(Product, {
          where: { id: item.productId },
        });
        item.price = product.price;
        return item;
      }),
    );
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    let discountAmount = 0;
    let promoIsValid = false;
    const promo = await this.promoService.findPromo(orderData.promoCode);

    promoIsValid = await this.promoService.checkValidity(
      orderData.userId,
      orderData.promoCode,
    );

    if (promoIsValid && promo.discountPercentage)
      discountAmount = (total * promo.discountPercentage) / 100;
    else if (promoIsValid && promo.discountAmount)
      discountAmount = promo.discountAmount;

    total -= discountAmount;
    return { total, discountAmount };
  }
}
