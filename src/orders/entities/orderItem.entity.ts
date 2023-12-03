import { Product } from 'src/products/entities/product.entity';
import {
  Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  price: number;

  @Column({ nullable: false })
  orderId: number;

  // TODO: check deleting product logic // protect or cascade ?
  @Column({ nullable: false })
  productId: string;

  @ManyToOne((type) => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne((type) => Product, (product) => product.orderItems, {onDelete: 'RESTRICT',})
  @JoinColumn({ name: 'productId' })
  product: Product;
}
 /**
   async calculateRequestCost(data: {
   serviceTypeId: string;
   promoCode?: string;
   vehicleId?: string;
   tips: number;
   userId: string
 }): Promise<{
   total: number;
   totalLBP: number;
 }> {

   let total: number = 0;
   let totalLBP: number = 0;

   const exchangeRateSetting: Setting = await this.settingsRepository
     .findOneOrFail({
       where: {
         key: EXCHANGE_RATE,
       },
     })
     .catch((err) => {
       throw new BadRequestException('Error calculating prices', err);
     });
   const exchangeRate: number = Number(exchangeRateSetting.value);

   const serviceType = await this.serviceTypesService.findOneByIdOrFail(
     data.serviceTypeId,
   );
   total += serviceType.price;
   totalLBP += exchangeRate * serviceType.price;

   if (data.vehicleId) {
     const vehicle = await this.vehiclesService.findOneByIdOrFail(
       data.vehicleId,
     );
     let key = vehicle.type + '_COST';
     let setting = await this.settingsService.findByKey(key);
     if (setting && setting.value != null) {
       total += Number(setting.value);
       totalLBP += exchangeRate * Number(setting.value);
     }
   }

   total += data.tips;
   totalLBP += exchangeRate * serviceType.price;

   let discountAmount: number = 0;
   let promoIsValid: boolean;
   const promo = await this.promoService.findOne(data.promoCode);
   promoIsValid = await this.promoService.checkValidity(data.userId, data.promoCode);

   if (promoIsValid && promo.discountPercentage) {
     discountAmount = total * promo.discountPercentage / 100;
   } else {
     if (promoIsValid && promo.discountAmount)
       discountAmount = promo.discountAmount;
   }
   total -= discountAmount;
   // todo: check for fees or other costs in case of payment by credit cards
   return { total, totalLBP };
 }

 */