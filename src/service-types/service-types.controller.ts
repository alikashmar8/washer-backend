import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ServiceTypesService } from './service-types.service';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
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
      throw new BadRequestException('Ad image is required!');
    } else {
      createServiceTypeDto.icon = icon.path;
    }
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
