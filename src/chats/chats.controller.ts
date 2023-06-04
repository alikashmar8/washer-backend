import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentEmployee } from 'src/common/decorators/current-employee.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './../auth/guards/auth.guard';
import { ChatsService } from './chats.service';

@ApiBearerAuth('access_token')
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(+id, updateChatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatsService.remove(+id);
  // }
}
