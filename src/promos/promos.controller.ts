import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Promos')
@ApiBearerAuth('access_token')
@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) { }

  @UseGuards(RolesGuard)
  @Roles(EmployeeRole.ADMIN)
  @Post()
  create(@Body() createPromoDto: CreatePromoDto) {
    return this.promosService.create(createPromoDto);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query) {
    return this.promosService.findAll(query);
  }
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promosService.findOneByIdOrFail(id);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromoDto: UpdatePromoDto) {
    return this.promosService.update(id, updatePromoDto);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promosService.remove(id);
  }
}
