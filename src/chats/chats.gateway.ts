import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from 'src/auth/guards/ws.guard';
import { ChatsService } from 'src/chats/chats.service';
import { CreateMessageDto } from 'src/chats/dto/chat.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { UsersService } from 'src/users/users.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: "chatGateway"
})
@UsePipes(new ValidationPipe())
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
    private employeesService: EmployeesService,
  ) {}

  @WebSocketServer() server: Server;

  // todo: delete connectedClients if not needed
  private connectedClients: Map<string, string> = new Map();

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, null);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('user_send_message')
  async handleUserSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    console.log(
      `Processing: User ${client.id} sent message: ${data.text}`,
    );
    // get access token from headers
    const token = client.handshake.headers.authorization.split(' ')[1];
    // get user that have this token
    const user = await this.usersService.findOneByToken(token);
    if (!user) return;
    // assign user id in data to submit
    data.userId = user.id;
    // create message in database
    const messageObj = await this.chatsService.createMessage(data);
    const chat = await this.chatsService.findChatByIdOrFail(messageObj.chatId, [
      'user',
      'employee',
    ]);
    // emit message to related employee only
    this.server.emit('messages-e' + chat.employeeId, { messageObj });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('employee_send_message')
  async handleEmployeeSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ) {
    console.log(
      `Processing: Employee ${client.id} sent message: ${data.text}`,
    );
    // get access token from headers
    const token = client.handshake.headers.authorization.split(' ')[1];
    // get employee that have this token
    const employee = await this.employeesService.findOneByToken(token);
    if (!employee) return;
    // assign employee id in data to submit
    data.employeeId = employee.id;
    // create message in database
    const messageObj = await this.chatsService.createMessage(data);
    const chat = await this.chatsService.findChatByIdOrFail(messageObj.chatId, [
      'user',
      'employee',
    ]);
    // emit message to related user only
    this.server.emit('messages-u' + chat.userId, { messageObj });
  }

  // todo: 1- check if notify on chat creation is needed
  //       2- ?
}
