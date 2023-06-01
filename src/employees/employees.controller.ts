import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import geoip from 'geoip-lite';
import * as path from 'path';
import { IsEmployeeGuard } from 'src/auth/guards/is-employee.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateEmployeeChatDTO } from 'src/chats/dto/create-employee-chat.dto';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { getMulterSettings } from 'src/common/utils/functions';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@ApiTags('Employees')
@UsePipes(new ValidationPipe())
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor(
      'photo',
      getMulterSettings({ destination: './public/uploads/employees' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access_token')
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentEmployee() employee: Employee,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    // if (!photo) {
    //   throw new BadRequestException('Employee photo is required!');
    // } else {
    //   createEmployeeDto.photo = photo.path;
    // }
    if (
      employee.role != EmployeeRole.ADMIN &&
      createEmployeeDto.role == EmployeeRole.ADMIN
    )
      throw new UnauthorizedException(
        'You are not allowed to create admin users',
      );
    return await this.employeesService.create(createEmployeeDto);
  }

  @Roles(EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE)
  @UseGuards(RolesGuard)
  @ApiQuery({ name: 'take', example: 10, required: false })
  @ApiQuery({ name: 'skip', example: 0, required: false })
  @ApiQuery({ name: 'search', example: 'Employee Ahmed', required: false })
  @ApiQuery({ name: 'branchId', example: '1', required: false })
  @ApiQuery({
    name: 'role',
    example: EmployeeRole.DRIVER,
    required: false,
    enum: EmployeeRole,
  })
  @ApiQuery({ name: 'isActive', example: true, required: false, type: Boolean })
  @Get()
  findAll(
    @Query()
    query: {
      search?: string;
      branchId?: string;
      role?: EmployeeRole;
      isActive?: boolean;
      take?: number;
      skip?: number;
    },
    @CurrentEmployee() employee: Employee,
  ) {
    return this.employeesService.findAll(query, employee);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @UseGuards(IsEmployeeGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentEmployee() employee: Employee) {
    console.log(employee);
    if (employee.role == EmployeeRole.DRIVER && employee.id == id) {
      return new UnauthorizedException(
        'You are not allowed to perform this action!',
      );
    }
    const employeeToDelete = await this.employeesService.findByIdOrFail(id);
    if (employee.role == EmployeeRole.BRANCH_EMPLOYEE) {
      if (employee.branchId != employeeToDelete.branchId) {
        return new UnauthorizedException(
          'You are not allowed to perform this action!',
        );
      }
    }
    if (employeeToDelete.photo) {
      const imagePath = path.join(process.cwd(), employeeToDelete.photo);

      try {
        await this.employeesService.deleteImage(id, imagePath);
      } catch (err) {
        console.error(`Error deleting image file: ${err.message}`);
      }
    }
    return await this.employeesService.remove(id);
  }

  @Patch('/:id/location')
  // @Roles(EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE)
  // @UseGuards(RolesGuard)
  // @UseGuards(IsEmployeeGuard)
  async updateLocation(
    @Req() req,
    @Param('id') id: string,
    @Body() location: UpdateLocationDto,
  ): Promise<Employee> {
    if (location.latitude && location.longitude) {
      return this.employeesService.updateLocation(
        id,
        location.latitude,
        location.longitude,
      );
    } else {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const location = geoip.lookup(ip);
      if (location) {
        const latitude = location.ll[0];
        const longitude = location.ll[1];
        return this.employeesService.updateLocation(id, latitude, longitude);
      } else {
        throw new HttpException(
          'Unable to determine location from IP',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(IsEmployeeGuard)
  @Post(':id/chats')
  async addNewChat(
    @Param('id') id: string,
    body: CreateEmployeeChatDTO,
    @CurrentEmployee() employee: Employee,
  ) {
    body.employeeId = employee.id;
    return await this.employeesService.createChat(body);
  }

  @UseGuards(IsEmployeeGuard)
  @Get(':id/chats')
  async getAllChats(
    @Param('id') id: string,
    @CurrentEmployee() employee: Employee,
  ) {
    return await this.employeesService.getEmployeeChats(employee.id);
  }
}
