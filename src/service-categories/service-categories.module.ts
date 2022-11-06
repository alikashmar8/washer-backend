import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceCategoriesController } from './service-categories.controller';
import { ServiceCategoriesService } from './service-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory])],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
