import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { AppService } from 'src/app.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/chats/entities/message.entity';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { CreateEmployeeChatDTO } from './../chats/dto/create-employee-chat.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private appService: AppService,
  ) {}

  async findById(id: string, relations?: string[]) {
    return await this.employeesRepository.findOne({
      where: {
        id: id,
      },
      relations,
    });
  }

  async findByIdOrFail(id: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: {
          id: id,
        },
        relations,
      })
      .catch(() => {
        throw new BadRequestException('Error employee not found!');
      });
  }
  async findByPhoneNumberOrFail(phoneNumber: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { phoneNumber: phoneNumber },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with phone number: ${phoneNumber} was not found`,
        );
      });
  }
  async findByUsernameOrFail(username: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { username },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with username: ${username} was not found`,
        );
      });
  }
  async findByEmailOrFail(email: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: { email: email },
        relations: relations,
      })
      .catch(() => {
        throw new BadRequestException(
          `Employee with email: ${email} was not found`,
        );
      });
  }

  async create(data: CreateEmployeeDto) {
    const exists = await this.employeesRepository.findOne({
      where: [
        { email: data.email },
        { phoneNumber: data.phoneNumber },
        { username: data.username },
      ],
    });
    if (exists) {
      throw new BadRequestException('Employee already exists!');
    }

    const employee = this.employeesRepository.create(data);
    return await this.employeesRepository.save(employee).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating employee!');
    });
  }

  async findAll(
    queryParams: {
      search?: string;
      branchId?: string;
      role?: EmployeeRole;
      isActive?: boolean;
      take?: number;
      skip?: number;
    },
    currentEmployee: Employee,
  ) {
    if (currentEmployee.role == EmployeeRole.DRIVER)
      throw new BadRequestException(
        'You are not allowed to perform this action!',
      );

    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let isFirstWhere = true;

    let query: any = this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.branch', 'branch');
    if (currentEmployee.role == EmployeeRole.BRANCH_EMPLOYEE) {
      if (isFirstWhere) isFirstWhere = false;
      query = query.where('employee.branchId :bId', {
        bId: currentEmployee.branchId,
      });
    }

    if (queryParams.branchId) {
      const queryString = 'employee.branchId = ' + queryParams.branchId;
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(queryString);
      } else {
        query = query.andWhere(queryString);
      }
    }

    if (queryParams.role) {
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where('employee.role = :role ', {
          role: queryParams.role,
        });
      } else {
        query = query.andWhere('employee.role = :role ', {
          role: queryParams.role,
        });
      }
    }

    if (queryParams.isActive == true || queryParams.isActive == false) {
      const queryString = 'employee.isActive = ' + queryParams.isActive;
    }
    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where('employee.isActive = :isActive', {
          isActive: queryParams.isActive,
        });
      } else {
        query = query.andWhere('employee.isActive = :isActive', {
          isActive: queryParams.isActive,
        });
      }
    }

    if (queryParams.search) {
      const innerQuery = new Brackets((qb) => {
        qb.where('employee.firstName like :name', {
          name: `%${queryParams.search}%`,
        })
          .orWhere('employee.lastName like :name', {
            name: `%${queryParams.search}%`,
          })
          .orWhere('employee.username like :username', {
            username: `%${queryParams.search}%`,
          })
          .orWhere('employee.email like :email', {
            email: `%${queryParams.search}%`,
          })
          .orWhere('employee.phoneNumber like :mobile', {
            mobile: `%${queryParams.search}%`,
          });
      });
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(innerQuery);
      } else {
        query = query.andWhere(innerQuery);
      }
    }
    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOne(id: string, relations?: string[]) {
    return await this.employeesRepository
      .findOneOrFail({
        where: {
          id: id,
        },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Employee not found', err);
      });
  }

  async update(id: string, data: UpdateEmployeeDto) {
    const employee = await this.findByIdOrFail(id);
    const imagePath = data.photo;
    delete data.photo;

    if (data.phoneNumber && employee.phoneNumber != data.phoneNumber) {
      const exists = await this.employeesRepository.findOne({
        where: { phoneNumber: data.phoneNumber },
      });
      if (exists) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    if (data.email && employee.email != data.email) {
      const exists = await this.employeesRepository.findOne({
        where: { email: data.email },
      });
      if (exists) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (data.username && employee.username != data.username) {
      const exists = await this.employeesRepository.findOne({
        where: { username: data.username },
      });
      if (exists) {
        throw new BadRequestException('Username already exists');
      }
    }

    return await this.employeesRepository
      .update(id, data)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating employee!', err);
      })
      .then((data) => {
        let res = { success: true };
        if (imagePath) {
          this.appService.updateFile(
            id,
            'photo',
            imagePath,
            this.employeesRepository,
          );
          res['photo'] = imagePath;
        }
        return res;
      });
  }

  async remove(id: string) {
    const employee = await this.findOneByIdOrFail(id);
    const photo = employee.photo;

    return await this.employeesRepository
      .softDelete(id)
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Error deleting employee!', err);
      })
      .then(async () => {
        if (photo) {
          const imagePath = path.join(process.cwd(), photo);
          try {
            await this.appService.deleteFile(imagePath);
          } catch (err) {
            console.error(err);
          }
        }
      });
  }

  async findOneByToken(token: any) {
    const deviceToken = await this.deviceTokensRepository.findOne({
      where: {
        status: DeviceTokenStatus.ACTIVE,
        loggedOutAt: null,
        token: token,
      },
      relations: ['employee'],
    });
    return deviceToken.employee;
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<Employee> {
    const employee = await this.employeesRepository.findOneById(id);
    if (!employee) {
      throw new BadRequestException(
        'Error updating location, employee not found',
      );
    }
    employee.currentLatitude = latitude;
    employee.currentLongitude = longitude;
    return await this.employeesRepository.save(employee);
  }

  async findOneByIdOrFail(id: string) {
    return await this.employeesRepository
      .findOneByOrFail({ id })
      .catch((err) => {
        throw new BadRequestException('Employee not found!', err);
      });
  }

  async createChat(body: CreateEmployeeChatDTO) {
    const exists = await this.chatsRepository.findOne({
      where: {
        employeeId: body.employeeId,
        userId: body.userId,
      },
    });

    if (exists) throw new BadRequestException('Chat already exists');

    return await this.chatsRepository.save({
      employeeId: body.employeeId,
      userId: body.userId,
    });
  }

  async getEmployeeChats(id: string) {
    let chats = await this.chatsRepository.find({
      where: {
        employeeId: id,
      },
      relations: ['user', 'employee'],
    });

    chats = await Promise.all(
      chats.map(async (chat) => {
        chat.unReadCount = await this.countChatEmployeeUnreadMessages(chat.id);
        return chat;
      }),
    );

    return chats;
  }

  async countChatEmployeeUnreadMessages(chatId: string) {
    const res = await this.messagesRepository.count({
      where: {
        chatId,
        userId: Not(IsNull()),
        isRead: false,
      },
    });

    return res;
  }
}
