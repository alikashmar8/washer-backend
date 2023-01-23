import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Query
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { Employee } from 'src/employees/entities/employee.entity';

@ApiTags('Orders')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(IsUserGuard)
    @Post()
    create(
        @Body() createOrderDto: CreateOrderDto,
        @CurrentUser() user: User,
    ) {
        createOrderDto.userId = user.id;
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Query()
    params: {
        userId?: string;
    },
        @CurrentUser() user: User,
        @CurrentEmployee() employee: Employee,
    ) {
        if (user)
            params.userId = user.id;

        return await this.ordersService.findAll(params);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(+id, updateOrderDto);
    }


}
