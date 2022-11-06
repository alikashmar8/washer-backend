import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@ApiTags('Ads')
@UsePipes(new ValidationPipe())
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createAdDto: CreateAdDto) {
    return await this.adsService.create(createAdDto);
  }

  @UseGuards(new AuthGuard())
  @Get()
  async findAll(
    @Query() query
  ) {
    return await this.adsService.findAll(query);
  }

  @UseGuards(new AuthGuard())
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adsService.findOneByIdOrFail(id);
  }
  
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return await this.adsService.update(id, updateAdDto);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adsService.remove(id);
  }
}
