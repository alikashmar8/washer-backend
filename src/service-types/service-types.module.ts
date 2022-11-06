import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/service-type.entity';
import { ServiceTypesController } from './service-types.controller';
import { ServiceTypesService } from './service-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService],
})
export class ServiceTypesModule {}
