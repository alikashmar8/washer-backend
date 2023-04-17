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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@ApiTags('Ads')
@UsePipes(new ValidationPipe())
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @UseInterceptors(
    FileInterceptor(
      'image',
      getMulterSettings({ destination: './public/uploads/ads' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access_token')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createAdDto: CreateAdDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Ad image is required!');
    } else {
      createAdDto.image = image.path;
    }
    return await this.adsService.create(createAdDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() query) {
    return await this.adsService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adsService.findOneByIdOrFail(id);
  }

  @UseInterceptors(
    FileInterceptor(
      'image',
      getMulterSettings({ destination: './public/uploads/ads' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access_token')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) await this.adsService.updateImage(id, file);
    return await this.adsService.update(id, updateAdDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access_token')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string) {
    return await this.adsService.remove(id);
  }
}
