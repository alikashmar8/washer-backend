import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { AddressesModule } from './addresses/addresses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { ConsoleCommandsModule } from './console-commands/console-commands.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { EmployeesModule } from './employees/employees.module';
import { PromosModule } from './promos/promos.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
