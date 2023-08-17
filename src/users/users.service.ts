import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUserChatDto } from 'src/chats/dto/create-user-chat.dto';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}
  async findByEmail(email: string, relations?: string[]): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: relations,
    });
  }
  async findByPhoneNumber(
    phoneNumber: string,
    relations?: string[],
  ): Promise<User> {
    return await this.usersRepository.findOne({
      where: { phoneNumber: phoneNumber },
      relations: relations,
    });
  }
  async findById(id: string, relations?: string[]) {
    return await this.usersRepository
      .findOneOrFail({
        where: { id: id },
        relations: relations,
      })
      .catch((err) => {
        throw new BadRequestException(`User not found!`);
      });
  }

  async findByUsernameOrFail(username: string, relations?: string[]) {
    return await this.usersRepository
      .findOneOrFail({
        where: { username: username },
        relations: relations,
      })
      .catch((err) => {
        throw new BadRequestException(`User ${username} not found!`);
      });
  }

  async findByUsername(username: string, relations?: string[]) {
    return await this.usersRepository.findOne({
      where: { username: username },
      relations: relations,
    });
  }

  async create(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating user!');
    });
  }

  async findAll(filters: {
    take?: number;
    skip?: number;
    search?: number;
    isActive?: boolean;
  }) {
    const take = filters.take || 10;
    const skip = filters.skip || 0;

    let query: any = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id is not null');

    if (filters.isActive != null) {
      if (typeof filters.isActive == 'string') {
        if (filters.isActive == 'true') {
          filters.isActive = true;
        } else if (filters.isActive == 'false') {
          filters.isActive = false;
        }
      }
      query = query.where('user.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.search) {
      let innerQuery = new Brackets((qb) => {
        qb.where('user.firstName like :name', {
          name: `%${filters.search}%`,
        })
          .orWhere('user.lastName like :name', {
            name: `%${filters.search}%`,
          })
          .orWhere('user.username like :username', {
            username: `%${filters.search}%`,
          })
          .orWhere('user.email like :email', {
            email: `%${filters.search}%`,
          })
          .orWhere('user.phoneNumber like :mobile', {
            mobile: `%${filters.search}%`,
          });
      });

      query = query.andWhere(innerQuery);
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async update(id: string, data: UpdateUserDto) {
    const newImage = data.photo;
    delete data.photo;

    await this.usersRepository
      .update(id, data)
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Error updating user', err);
      })
      .then(async () => {
        if (newImage) {
          const user = await this.usersRepository.findOne({ where: { id } });

          const oldFile = user.photo;

          await this.usersRepository.update(id, { photo: newImage });

          if (oldFile) {
            const oldFilePath = path.join(process.cwd(), oldFile);
            try {
              if (fs.existsSync(oldFilePath)) {
                // file exists, delete it
                fs.unlinkSync(oldFilePath);
                console.log('Image File deleted');
              } else {
                console.log(`File does not exist: ${oldFilePath}`);
              }
            } catch (err) {
              console.error(
                `Failed to delete old photo file ${oldFile}: ${err}`,
              );
            }
          }
        }
      });
    return await this.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByToken(token: string) {
    const deviceToken = await this.deviceTokensRepository.findOne({
      where: {
        status: DeviceTokenStatus.ACTIVE,
        loggedOutAt: null,
        token: token,
      },
      relations: ['user'],
    });
    return deviceToken.user;
  }

  async findOneOrFail(id: string, relations?: string[]) {
    return await this.usersRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('User not found!', err);
      });
  }

  async createChat(body: CreateUserChatDto) {
    const exists = await this.chatsRepository.findOne({
      where: {
        employeeId: body.employeeId,
        userId: body.userId,
      },
      relations: ['user', 'employee'],
    });

    if (exists) return exists;

    const newChat = await this.chatsRepository.save({
      employeeId: body.employeeId,
      userId: body.userId,
    });

    return await this.chatsRepository.findOne({
      where: { id: newChat.id },
      relations: ['user', 'employee'],
    });
  }

  async getUserChats(id: string) {
    let chats = await this.chatsRepository.find({
      where: {
        userId: id,
      },
      relations: ['user', 'employee'],
    });

    chats = await Promise.all(
      chats.map(async (chat) => {
        chat.unReadCount = await this.countChatUnreadMessages(chat.id, id);
        return chat;
      }),
    );

    return chats;
  }

  async countChatUnreadMessages(chatId: string, userId: string) {
    const res = await this.messagesRepository.count({
      where: {
        chatId,
        userId,
        isRead: false,
      },
    });

    return res;
  }
}
