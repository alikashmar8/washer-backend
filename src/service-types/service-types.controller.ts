import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ServiceTypesService } from './service-types.service';

@ApiTags('Service Types')
@UsePipes(new ValidationPipe())
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    return await this.serviceTypesService.create(createServiceTypeDto);
  }

  // @Get()
  // findAll() {
  //   return this.serviceTypesService.findAll();
  // }

  @UseGuards(new AuthGuard())
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceTypesService.findOneByIdOrFail(id);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
  ) {
    return this.serviceTypesService.update(id, updateServiceTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.serviceTypesService.remove(id);
  }
}
