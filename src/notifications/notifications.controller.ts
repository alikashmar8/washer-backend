import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './../auth/guards/auth.guard';
import { NotificationsService } from './notifications.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SendGlobalNotificationDTO } from './dto/send-global-notification.dto';
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query()
    query: {
      userId?: string;
      employeeId?: string;
    },
    @CurrentUser() currentUser: User,
    @CurrentEmployee() currentEmployee: Employee,
  ) {
    if (currentEmployee) {
      query.employeeId = currentEmployee.id;
      query.userId = null;
    } else {
      query.userId = currentUser.id;
      query.employeeId = null;
    }
    return await this.notificationsService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationsService.findOneOrFail(id);
  // }

  @UseGuards(AuthGuard)
  @Patch(':id/markRead')
  async makeItRead(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
    @CurrentEmployee() currentEmployee: Employee,
  ) {
    const notification = await this.notificationsService.findOneOrFail(id);
    if (currentEmployee && notification.employeeId != currentEmployee.id) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action!',
      );
    }
    if (currentUser && notification.userId != currentUser.id) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action!',
      );
    }
    return await this.notificationsService.updateIsRead(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(id);
  // }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('sendGlobalNotification')
  async sendGlobalNotification(
    @CurrentEmployee() currentEmployee: Employee,
    @Body() data: SendGlobalNotificationDTO
  ) {
    return await this.notificationsService.sendGlobalNotification(data);
  }

}
