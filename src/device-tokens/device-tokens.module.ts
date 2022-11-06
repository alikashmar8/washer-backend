import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTokensController } from './device-tokens.controller';
import { DeviceTokensService } from './device-tokens.service';
import { DeviceToken } from './entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  controllers: [DeviceTokensController],
  providers: [DeviceTokensService],
})
export class DeviceTokensModule {}
