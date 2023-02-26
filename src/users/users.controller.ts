import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneOrFail(id, [
      'addresses',
      'promos',
      'vehicles',
      'wallet',
    ]);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
