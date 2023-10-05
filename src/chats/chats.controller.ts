import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './../auth/guards/auth.guard';
import { ChatsService } from './chats.service';
import { SendGlobalMessageDTO } from './dto/send-global-message.dto';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // @Post()
  // async create(@Body() createChatDto: CreateChatDto) {
  //   return await this.chatsService.create(createChatDto);
  // }

  // @Get()
  // findAll() {
  //   return this.chatsService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get(':id/messages')
  async getChatMessages(@Param('id') id: string, @Query() query: any) {
    return await this.chatsService.findChatMessages(id, query);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/messages')
  async markChatMessagesRead(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @CurrentEmployee() employee: Employee,
  ) {
    return await this.chatsService.markChatMessagesRead(id, user, employee);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(+id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatsService.remove(+id);
  // }

  @Roles(EmployeeRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('sendGlobalMessage')
  async sendGlobalMessage(
    @Body() dto: SendGlobalMessageDTO,
    @CurrentEmployee() currentEmployee: Employee,
  ) {
    this.chatsService.sendGlobalMessage(currentEmployee, dto);
    return { message: 'Sending message in progress...' };
  }
}
