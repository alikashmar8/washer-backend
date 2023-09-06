import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PromosService } from 'src/promos/promos.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { POINTS_PER_ORDER_PERCENTAGE } from './../common/constants';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-orderItem.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderStatus } from './enums/order-status.enum';

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

      //TODO: update product quantity--;
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

      // add points and money to user
      const pointsPerOrderPercentageSetting: Setting = await queryRunner.manager
        .findOneOrFail(Setting, {
          where: {
            key: POINTS_PER_ORDER_PERCENTAGE,
          },
        })
        .catch((err) => {
          throw new BadRequestException(
            'Error while crediting your points! Order is not completed.',
            err,
          );
        });
      const pointsPerOrderPercentage = Number(
        pointsPerOrderPercentageSetting.value,
      );
      if (pointsPerOrderPercentage > 0) {
        const customer = await queryRunner.manager.findOne(User, {
          where: { id: order.userId },
          relations: ['wallet'],
        });
        const pointsGained = Math.floor(
          total * (pointsPerOrderPercentage / 100),
        );
        const newTotalPoints = customer.points + pointsGained;
        await queryRunner.manager.update(User, customer.id, {
          points: newTotalPoints,
        });

        const newWalletBalance = customer.wallet.balance + pointsGained;
        await queryRunner.manager.update(Wallet, customer.wallet.id, {
          balance: newWalletBalance,
        });
      }

      await queryRunner.manager.save(OrderItem, items).catch((err) => {
        console.log(err);
        throw new BadRequestException('Error saving items !');
      });

      await queryRunner.manager
        .update(
          Order,
          { id: order.id },
          { total: total, discountAmount: order.discountAmount },
        )
        .catch((err) => {
          console.log(err);
          throw new BadRequestException('Error Order Creation!');
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

  async findAll(queryParams: {
    take: number;
    skip: number;
    userId?: string;
    search?: string;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id IS NOT NULL');

    if (queryParams.userId) {
      query = query.andWhere('order.userId = :uid', {
        uid: queryParams.userId,
      });
    }

    if (queryParams.search) {
      const innerQuery = new Brackets((qb) => {
        qb.where('user.firstName like :name', {
          name: `%${queryParams.search}%`,
        })
          .orWhere('user.lastName like :name', {
            name: `%${queryParams.search}%`,
          })
          .orWhere('user.username like :username', {
            username: `%${queryParams.search}%`,
          })
          .orWhere('user.email like :email', {
            email: `%${queryParams.search}%`,
          })
          .orWhere('order.id like :id', {
            id: `%${queryParams.search}%`,
          })
          .orWhere('order.total like :total', {
            total: `%${queryParams.search}%`,
          })
          .orWhere('order.status like :status', {
            status: `%${queryParams.search}%`,
          })
          .orWhere('order.createdAt like :date', {
            date: `%${queryParams.search}%`,
          });
      });
      query = query.andWhere(innerQuery);
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOneByIdOrFail(id: number, relations?: string[]) {
    return await this.ordersRepository
      .findOneOrFail({ where: { id: id }, relations })
      .catch((err) => {
        throw new BadRequestException('Order not found!', err);
      });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.ordersRepository
      .update(id, updateOrderDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating order!');
      });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await this.ordersRepository
      .createQueryBuilder()
      .update()
      .set({ status: status })
      .where('id = :id', { id: id })
      .execute()
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating order status!');
      });
  }

  async remove(id: number) {
    return await this.ordersRepository.delete(id).catch(() => {
      throw new BadRequestException('Error deleting order');
    });
  }

  async calculateTotal(
    orderData: CreateOrderDto,
    items: CreateOrderItemDto[],
  ): Promise<{ total: number; discountAmount: number }> {
    let total = 0;

    items = await Promise.all(
      items.map(async (item) => {
        const product = await this.productsRepository.findOneOrFail({
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
