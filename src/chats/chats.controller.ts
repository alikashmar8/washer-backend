import { AuthGuard } from './../auth/guards/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';

// @ApiTags('Chats')
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
  async getChatMessages(
    @Param('id') id: string,
    @CurrentEmployee() employee: Employee,
    @CurrentUser() user: User,
    @Query() query: any
  ) {
    query.userId = user.id;
    query.employeeId = employee.id;
    return await this.chatsService.findChatMessages(id, query);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(+id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatsService.remove(+id);
  // }
}
