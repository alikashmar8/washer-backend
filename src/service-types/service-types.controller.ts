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
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ServiceTypesService } from './service-types.service';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Service Types')
@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor(
      'icon',
      getMulterSettings({ destination: './public/uploads/service-types' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Body() createServiceTypeDto: CreateServiceTypeDto,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    if (!icon) {
      throw new BadRequestException('Service image is required!');
    } else {
      createServiceTypeDto.icon = icon.path;
    }
    return await this.serviceTypesService.create(createServiceTypeDto);
  }

  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'isActive', example: true, required: false })
  @ApiQuery({ name: 'categoryId', example: '37', required: false })
  @ApiQuery({ name: 'search', example: 'Washing Service', required: false })
  @Get()
  async findAll(@Query() query: any) {
    return await this.serviceTypesService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceTypesService.findOneByIdOrFail(id);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor(
      'icon',
      getMulterSettings({ destination: './public/uploads/service-types' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) updateServiceTypeDto.icon = file.path;
    return await this.serviceTypesService.update(id, updateServiceTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.serviceTypesService.remove(id);
  }
}
