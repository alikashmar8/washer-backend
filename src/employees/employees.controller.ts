import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsEmployeeGuard } from 'src/auth/guards/is-employee.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@ApiTags('Employees')
@UsePipes(new ValidationPipe())
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentEmployee() employee: Employee,
  ) {
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

  @UseGuards(new IsEmployeeGuard())
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentEmployee() employee: Employee) {
    if (employee.role == EmployeeRole.DRIVER && employee.id == id) {
      return new UnauthorizedException(
        'You are not allowed to perform this action!',
      );
    }

    if (employee.role == EmployeeRole.BRANCH_EMPLOYEE) {
      const employeeToDelete = await this.employeesService.findByIdOrFail(id);
      if (employee.branchId != employeeToDelete.branchId) {
        return new UnauthorizedException(
          'You are not allowed to perform this action!',
        );
      }
    }
    return await this.employeesService.remove(id);
  }
}
