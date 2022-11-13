import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { AddressesModule } from './addresses/addresses.module';
import { AdsModule } from './ads/ads.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { BranchesService } from './branches/branches.service';
import { Branch } from './branches/entities/branch.entity';
import { ConsoleCommandsModule } from './console-commands/console-commands.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesService } from './employees/employees.service';
import { Employee } from './employees/entities/employee.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { PromosModule } from './promos/promos.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    TypeOrmModule.forFeature([Branch, Employee]),
    ConsoleCommandsModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    AddressesModule,
    VehiclesModule,
    BranchesModule,
    PromosModule,
    CreditCardsModule,
    WalletsModule,
    TransactionsModule,
    ServiceRequestsModule,
    ServiceCategoriesModule,
    ServiceTypesModule,
    DeviceTokensModule,
    NotificationsModule,
    AdsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BranchesService, EmployeesService],
})
export class AppModule {}
