import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { CreateUserChatDto } from './../chats/dto/create-user-chat.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { IsEmployeeGuard } from 'src/auth/guards/is-employee.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { Employee } from 'src/employees/entities/employee.entity';
import { Response } from 'express';

@UsePipes(new ValidationPipe())
@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query() queryParams: { take: number; skip: number; search: number },
  ) {
    return await this.usersService.findAll(queryParams);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneOrFail(id, [
      'addresses',
      'promos',
      'vehicles',
      'wallet',
    ]);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(IsEmployeeGuard)
  @Post(':id/chats')
  async addNewChat(
    @Param('id') id: string,
    @Body() body: CreateUserChatDto,
    @CurrentEmployee() employee: Employee,
  ) {
    body.employeeId = employee.id;
    return await this.usersService.createChat(body);
  }

  @UseGuards(IsUserGuard)
  @Get(':id/chats')
  async getAllChats(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.usersService.getUserChats(user.id);
  }
}
