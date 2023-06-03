import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateMessageDto } from './dto/chat.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(data: CreateMessageDto) {
    this.chatsRepository
      .update(data.chatId, {
        lastMessage: data.message,
        lastMessageDate: new Date(),
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
      userId?: string;
      employeeId?: string;
      take?: number;
      skip?: number;
    },
  ) {
    const take = filters.take || 15;
    const skip = filters.skip || 0;
    const res =  await this.messagesRepository.findAndCount({
      where: {
        chatId,
        userId: filters.userId,
        employeeId: filters.employeeId,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: take,
    });

    return {
      data: res[0],
      count: res[1],
    }
  }
}
