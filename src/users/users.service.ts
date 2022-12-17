import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
}
