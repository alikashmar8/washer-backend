import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryStatusDto } from './dto/update-service-category-status.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategoriesService } from './service-categories.service';

@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Services Categories')
@ApiBearerAuth('access_token')
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
  ) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor(
      'icon',
      getMulterSettings({ destination: './public/uploads/categories' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    if (!icon) {
      throw new BadRequestException('Category icon is required!');
    } else {
      createServiceCategoryDto.icon = icon.path;
    }
    
    if (
      createServiceCategoryDto.showQuantityInput &&
      createServiceCategoryDto.showVehicleSelection
    ) {
      throw new BadRequestException(
        'Cannot show both quantity input and vehicle selection at the same time!',
      );
    }
    if (
      !createServiceCategoryDto.showQuantityInput &&
      !createServiceCategoryDto.showVehicleSelection
    ) {
      throw new BadRequestException(
        'Must show either quantity input or vehicle selection!',
      );
    }
    return await this.serviceCategoriesService.create(createServiceCategoryDto);
  }

  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'isActive', example: true, required: false })
  @ApiQuery({ name: 'search', example: 'Washing Service', required: false })
  @Get()
  async findAll(@Query() query: any) {
    return await this.serviceCategoriesService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceCategoriesService.findOneByIdOrFail(id);
  }

  @UseInterceptors(
    FileInterceptor(
      'icon',
      getMulterSettings({ destination: './public/uploads/categories' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access_token')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceCategoryDto?: UpdateServiceCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) updateServiceCategoryDto.icon = file.path;

    
    // const updatingShowQuantityInput = "showQuantityInput" in updateServiceCategoryDto;
    // const updatingShowVehicleSelection = "showVehicleSelection" in updateServiceCategoryDto;
     // if (
    //   updateServiceCategoryDto.showQuantityInput &&
    //   updateServiceCategoryDto.showVehicleSelection
    // ) {
    //   throw new BadRequestException(
    //     'Cannot show both quantity input and vehicle selection at the same time!',
    //   );
    // }
    // if (
    //   !updateServiceCategoryDto.showQuantityInput &&
    //   !updateServiceCategoryDto.showVehicleSelection
    // ) {
    //   throw new BadRequestException(
    //     'Must show either quantity input or vehicle selection!',
    //   );
    // }
    return await this.serviceCategoriesService.update(
      id,
      updateServiceCategoryDto,
    );
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
