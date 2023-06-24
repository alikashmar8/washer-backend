import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseInterceptors,
  ValidationPipe
} from '@nestjs/common';
import {
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UsePipes,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { getMulterSettings } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@ApiTags('Vehicles')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseInterceptors(
    FileInterceptor(
      'photo',
      getMulterSettings({ destination: './public/uploads/vehicles' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @UseGuards(IsUserGuard)
  @Post()
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFile() photo: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (photo) {
      createVehicleDto.photo = photo.path;
    }

    createVehicleDto.userId = user.id;
    return await this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query()
    params: {
      userId?: string;
    },
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    if (user) {
      params.userId = user.id;
    }
    return await this.vehiclesService.findAll(params);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vehiclesService.findOne(+id);
  // }

  @UseInterceptors(
    FileInterceptor(
      'photo',
      getMulterSettings({ destination: './public/uploads/vehicles' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access_token')
  @UseGuards(IsUserGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto?: UpdateVehicleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateVehicleDto.photo = file.path;
    }
    return await this.vehiclesService.update(id, updateVehicleDto);
  }

  @UseGuards(IsUserGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const vehicle = await this.vehiclesService.findOneByIdOrFail(id);
    if (vehicle.userId != user.id)
      throw new UnauthorizedException(
        'You are not allowed to perform this action!',
      );

    return await this.vehiclesService.remove(id);
  }
}
