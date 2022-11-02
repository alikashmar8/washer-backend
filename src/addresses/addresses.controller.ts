import {
  Body,
  Controller,
  Delete, HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(new IsUserGuard())
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser() user: User,
  ) {
    let body: CreateUserAddressDto = { ...createAddressDto, userId: user.id };
    return await this.addressesService.create(body);
  }

  @UseGuards(new AuthGuard())
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    if (
      employee &&
      ![EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE].includes(
        employee.type,
      )
    ) {
      throw new HttpException(
        'You are not allowed to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const address = await this.addressesService.findByIdOrFail(id);
    if (user && address.isUserAddress && address.userId != user.id) {
      throw new HttpException(
        'You are not allowed to perform this action',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.addressesService.update(id, updateAddressDto);
  }

  @UseGuards(new AuthGuard())
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    return await this.addressesService.remove(id, user, employee);
  }
}
