import {
  BadRequestException,
  Body,
  Controller, Get,
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
import { CalculateRequestTotal } from './dto/calculate-request-total.dto';
import { IsEmployeeGuard } from 'src/auth/guards/is-employee.guard';
import { UpdateServiceRequestPaymentStatusDto } from './dto/update-service-request-payment-status.dto';

@ApiBearerAuth('access_token')
@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @UseGuards(IsUserGuard)
  @Post()
  create(@Body() body: CreateServiceRequestDto, @CurrentUser() user: User) {
    if (!user)
      throw new HttpException('Authorization error', HttpStatus.UNAUTHORIZED);
    body.userId = user.id;
    return this.serviceRequestsService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query()
    query: {
      userId?: string;
      employeeId?: string;
      branchId?: string;
      take?: number;
      skip?: number;
      lat?: number;
      lon?: number;
    },
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    if (
      employee &&
      employee.role == EmployeeRole.DRIVER &&
      (!query.lat || !query.lon)
    )
      throw new BadRequestException('Error retrieving your location!');
    if (user) {
      query.userId = user.id;
    } else if (
      employee &&
      [EmployeeRole.BRANCH_EMPLOYEE, EmployeeRole.DRIVER].includes(
        employee.role,
      )
    ) {
      query.branchId = employee.branchId;
    }
    return await this.serviceRequestsService.findAll(query, employee, user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const serviceReq = await this.serviceRequestsService.findOneByIdOrFail(id);
    if (user && user.id != serviceReq.userId)
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    return serviceReq;
  }

  @UseGuards(AuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateServiceRequestStatusDto,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    // TODO: return paid amount if exists
    // user can only cancel a request

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

  @UseGuards(IsEmployeeGuard)
  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: UpdateServiceRequestPaymentStatusDto,
    @CurrentEmployee() employee: Employee,
  ) {
    return await this.serviceRequestsService.updatePaymentStatus(id, body);
  }

  @UseGuards(IsUserGuard)
  @Post('calculate-total')
  async getTotal(@Body() body: CalculateRequestTotal, @CurrentUser() user: User) {
    return await this.serviceRequestsService.calculateRequestCost(body,user.id)
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.serviceRequestsService.remove(+id);
  // }
}
