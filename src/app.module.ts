import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { join } from 'path';
import { AddressesModule } from './addresses/addresses.module';
import { AdsModule } from './ads/ads.module';
import { AdsService } from './ads/ads.service';
import { Ad } from './ads/entities/ad.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { BranchesService } from './branches/branches.service';
import { Branch } from './branches/entities/branch.entity';
import { CategoriesModule } from './categories/categories.module';
import { ChatsModule } from './chats/chats.module';
import { ChatsService } from './chats/chats.service';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './chats/entities/message.entity';
import { MailModule } from './common/mail/mail.module';
import { ConsoleCommandsModule } from './console-commands/console-commands.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { DeviceToken } from './device-tokens/entities/device-token.entity';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesService } from './employees/employees.service';
import { Employee } from './employees/entities/employee.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsService } from './notifications/notifications.service';
import { OrdersModule } from './orders/orders.module';
import { ProductImage } from './products/entities/product-image.entity';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';
import { PromosModule } from './promos/promos.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { Setting } from './settings/entities/setting.entity';
import { SettingsModule } from './settings/settings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
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
    TypeOrmModule.forFeature([
      Branch,
      Employee,
      DeviceToken,
      User,
      Setting,
      Employee,
      Ad,
      Product,
      ProductImage,
      Chat,
      Message,
      Notification,
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'), // added ../ to get one folder back
      serveRoot: '/public/', //last slash is important
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<string>('mail.port'),
          ignoreTLS: configService.get<string>('mail.ignoreTLS'),
          secure: configService.get<string>('mail.secure'),
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.pass'),
          },
        },
        // defaults: {
        //   from: '"No Reply" <no-reply@localhost>',
        // },
        preview: true,
        // template: {
        //   dir: __dirname + '/templates',
        //   adapter: new PugAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
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
    ServiceCategoriesModule,
    ServiceTypesModule,
    DeviceTokensModule,
    NotificationsModule,
    AdsModule,
    SettingsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    MailModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BranchesService,
    EmployeesService,
    UsersService,
    AdsService,
    ProductsService,
    ChatsService,
    NotificationsService,
  ],
})
export class AppModule {
  constructor(configService: ConfigService) {
    console.log(configService.get<string>('mail'));
  }
}
