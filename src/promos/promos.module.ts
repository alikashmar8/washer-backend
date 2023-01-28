import { Module } from '@nestjs/common';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, Employee, DeviceToken])],
  controllers: [PromosController],
  providers: [PromosService, EmployeesService]
})
export class PromosModule { }
