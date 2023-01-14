import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(@Query() query: {
    userId?: string;
    employeeId?: string;
  },
    @CurrentUser() currentUser: User,
    @CurrentEmployee() currentEmployee: Employee) {

    if (currentEmployee)
      query.employeeId = currentEmployee.id;
    else if (currentUser)
      query.userId = currentUser.id

    return this.notificationsService.findAll(query);
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOneOrFail(id);
  }

  @Patch(':id')
  async makeItRead(@Param('id') id: string) {
    return await this.notificationsService.updateIsRead(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
