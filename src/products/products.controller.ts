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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { IsUserGuard } from './../auth/guards/is-user.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth('access_token')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FilesInterceptor(
      'images[]',
      10,
      getMulterSettings({ destination: './public/uploads/products' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    console.log("createDTO",createProductDto);
    if (!images || !images.length) {
      throw new BadRequestException('product images are required!');
    } else {
      console.log("product 1");
      const imageList = images.map((image) => image.path);
      createProductDto.images = imageList;
    }

    // todo: check files type & test api
    return await this.productsService.create(createProductDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query()
    query: {
      search?: string;
      isActive?: boolean;
      take?: number;
      skip?: number;
    },
  ) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOneByIdOrFail(id, [
      'images',
      'category',
    ]);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }


  @UseInterceptors(
    FilesInterceptor(
      'images[]',
      10,
      getMulterSettings({ destination: './public/uploads/products' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // if (files) await this.productsService.updateImage(id, files);
    return await this.productsService.update(id, updateProductDto);
  }

  @UseGuards(IsUserGuard)
  @Patch(':id/views')
  async updateProductView(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.productsService.updateProductView(id);
  }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.findOne(id);
    return await this.productsService.remove(id);
  }
}
