import { ChatsService } from './chats.service';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface.d';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Bind, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { Socket } from 'socket.io';
import { Server } from 'typeorm';
import { WsGuard } from 'src/auth/guards/ws.guard';
import { CreateMessageDto } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { EmployeesService } from 'src/employees/employees.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: "chatGateway"
})
@UsePipes(new ValidationPipe())
export class ChatsGateway implements NestGateway {
  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
    private employeesService: EmployeesService
    ) {}

  @WebSocketServer() wss: Server;

  afterInit(server: any) {
    console.log('afterInit');
    // console.log('afterInit', server);
  }

  handleConnection(client: any) {
    console.log('Connected Client', client.id);
    // process.nextTick(() => {
    //   client.emit('allChats', "this.chatsService.getAllChats()");
    // });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('user_send_message')
  async handleUserSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    const user = await this.usersService.findOneByToken(token);
    if (!user) return;
    data.userId = user.id;
    // create message
    const chatMessage = await this.chatsService.createMessage(
      data      
    );

    // const { chatId } = data;

    // notify connected users
    this.wss
      // .to(chatId)
      .emit('messages', { message: chatMessage });
  }

  
  @UseGuards(WsGuard)
  @SubscribeMessage('employee_send_message')
  async handleEmployeeSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    const employee = await this.employeesService.findOneByToken(token);
    if (!employee) return;
    data.employeeId = employee.id;
    // create message
    const chatMessage = await this.chatsService.createMessage(
      data      
    );

    // const { chatId } = data;

    // notify connected users
    this.wss
      // .to(chatId)
      .emit('messages', { message: chatMessage });
  }

  handleDisconnect(client: any) {
    console.log('Client Disconnected');
  }
}
