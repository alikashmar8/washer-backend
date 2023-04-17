import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(IsUserGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    createOrderDto.userId = user.id;
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query()
    params: {
      userId?: string;
      search?: string;
      take: number;
      skip: number;
    },
    @CurrentUser() user: User,
  ) {
    if (user) params.userId = user.id;

    return await this.ordersService.findAll(params);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOneByIdOrFail(+id, ['orderItems', 'user'])
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }

  @UseGuards(IsUserGuard)
  @Post('calculate-total')
  async getTotal(@Body() data: CreateOrderDto) {
    return await this.ordersService.calculateTotal(data, data.orderItems);
  }
}
