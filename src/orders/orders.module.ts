import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Product } from 'src/products/entities/product.entity';
import { Promo } from 'src/promos/entities/promo.entity';
import { PromosService } from 'src/promos/promos.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, DeviceToken, Employee, OrderItem, Product, Promo])],
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, EmployeesService, PromosService]
})
export class OrdersModule { }
