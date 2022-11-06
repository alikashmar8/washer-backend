import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnauthorizedException
} from '@nestjs/common';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { ServiceRequestsService } from './service-requests.service';

@ApiBearerAuth('access_token')
@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @UseGuards(new IsUserGuard())
  @Post()
  create(@Body() body: CreateServiceRequestDto, @CurrentUser() user: User) {
    if (!user)
      throw new HttpException('Authorization error', HttpStatus.UNAUTHORIZED);
    body.userId = user.id;
    return this.serviceRequestsService.create(body);
  }

  @UseGuards(new AuthGuard())
  @Get()
  async findAll(
    @Query() query: any,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    if (user) {
      query.userId = user.id;
    } else if (employee) {
      if (employee.role == EmployeeRole.DRIVER) {
        query.employeeId = employee.id;
      } else if (employee.role == EmployeeRole.BRANCH_EMPLOYEE) {
        query.branchId = employee.branchId;
      }
    }
    return await this.serviceRequestsService.findAll(query);
  }

  @UseGuards(new AuthGuard())
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const serviceReq = await this.serviceRequestsService.findOneByIdOrFail(id);
    if (user && user.id != serviceReq.userId)
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    return serviceReq;
  }

  @UseGuards(new AuthGuard())
  @Patch(':id/update-status')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateServiceRequestStatusDto,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    //user can only cancel a request
    if (user && body.status != RequestStatus.CANCELLED)
      throw new BadRequestException(
        'You are not allowed to perform this action!',
      );
    if (employee) {
      if (
        employee.role == EmployeeRole.DRIVER &&
        ![RequestStatus.DONE, RequestStatus.IN_PROGRESS].includes(body.status)
      )
        throw new BadRequestException(
          'You are not allowed to perform this action!',
        );
    }
    if (user) {
      const serviceReq = await this.serviceRequestsService.findOneByIdOrFail(
        id,
      );
      if (user.id != serviceReq.userId)
        throw new UnauthorizedException(
          'You are not allowed to perform this action!',
        );
    }
    return await this.serviceRequestsService.updateStatus(id, body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.serviceRequestsService.remove(+id);
  // }
}
