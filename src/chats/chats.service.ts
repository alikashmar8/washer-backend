import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { ChatSenderType } from './dto/chat-sender-type.dto';
import { CreateMessageDto } from './dto/chat.dto';
import { SendGlobalMessageDTO } from './dto/send-global-message.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async createMessage(data: CreateMessageDto) {
    this.chatsRepository
      .update(data.chatId, {
        lastMessage: data.text,
        lastMessageDate: new Date(),
        lastSenderType: data.lastSenderType,
      })
      .catch((err) => {
        console.log('error updating Chat after message sent!', err);
      });
    return await this.messagesRepository.save(data);
  }

  async findChatByIdOrFail(chatId: string, relations?: string[]) {
    return await this.chatsRepository
      .findOneOrFail({
        where: { id: chatId },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Chat not found!');
      });
  }

  async findChatMessages(
    chatId: string,
    filters: {
      take?: number;
      skip?: number;
    },
  ) {
    const take = filters.take || 15;
    const skip = filters.skip || 0;
    const res = await this.messagesRepository.findAndCount({
      where: {
        chatId,
      },
      order: {
        sentTimestamp: 'ASC',
      },
      skip: skip,
      take: take,
    });

    return {
      data: res[0],
      count: res[1],
    };
  }

  async markChatMessagesRead(chatId: string, user: User, employee: Employee) {
    const key = user ? 'userId' : 'employeeId';
    const value = user ? user.id : employee.id;

    const res = await this.messagesRepository.update(
      {
        chatId,
        [key]: value,
        isRead: false,
      },
      { isRead: true },
    );

    return res;
  }

  async findChatOrCreate(employeeId, userId) {
    const exists = await this.chatsRepository.findOne({
      where: {
        employeeId: employeeId,
        userId: userId,
      },
    });

    if (exists) return exists;

    return await this.chatsRepository.save({
      employeeId: employeeId,
      userId: userId,
    });
  }

  async sendGlobalMessage(
    currentEmployee: Employee,
    data: SendGlobalMessageDTO,
  ) {
    const users = await this.usersRepository.find({
      where: {
        isActive: true,
      },
      relations: ['deviceTokens'],
    });

    users.forEach(async (user) => {
      const chat = await this.findChatOrCreate(currentEmployee.id, user.id);
      // create message in database
      const messageObj = await this.createMessage({
        chatId: chat.id,
        userId: user.id,
        employeeId: currentEmployee.id,
        lastSenderType: ChatSenderType.EMPLOYEE,
        sentTimestamp: Math.floor(Date.now() / 1000),
        text: data.text,
      });

      await this.notificationsService.createAndNotify({
        title: 'New Message',
        body: data.text,
        userId: chat.userId,
        type: NotificationType.CHAT_MESSAGE,
      });
      return;
    });
  }
}
