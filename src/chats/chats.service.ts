import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateMessageDto } from './dto/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(data: CreateMessageDto) {
    return await this.chatsRepository.save(data);
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

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
