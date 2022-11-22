import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsEmployeeGuard } from 'src/auth/guards/is-employee.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateServiceCategoryStatusDto } from './dto/update-service-category-status.dto';

@ApiTags('Services Categories')
@UsePipes(new ValidationPipe())
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return await this.serviceCategoriesService.create(createServiceCategoryDto);
  }

  @UseGuards(new AuthGuard())
  @ApiQuery({ name: 'isActive', example: true, required: false })
  @ApiQuery({ name: 'search', example: 'Washing Service', required: false })
  @Get()
  async findAll(@Query() query: any) {
    return await this.serviceCategoriesService.findAll(query);
  }

  @UseGuards(new AuthGuard())
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceCategoriesService.findOneByIdOrFail(id);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    return await this.serviceCategoriesService.update(id, updateServiceCategoryDto);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateServiceCategoryStatusDto,
  ) {
    return await this.serviceCategoriesService.updateStatus(id, body);
  }

  
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.serviceCategoriesService.remove(id);
  }
}
