import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { BranchesService } from 'src/branches/branches.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Product } from './entities/product.entity';
import { ImageFileService } from './imageFile.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      DeviceToken,
      Employee,
      Setting,
      Branch,
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UsersService,
    DeviceTokensService,
    EmployeesService,
    ImageFileService,
    AppService,
    BranchesService,
  ],
})
export class ProductsModule {}
