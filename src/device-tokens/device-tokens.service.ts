import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { Repository } from 'typeorm';
import { CreateEmployeeDeviceTokenDto } from './dto/create-employee-device-token.dto';
import { CreateUserDeviceTokenDto } from './dto/create-user-device-token.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { DeviceToken } from './entities/device-token.entity';

@Injectable()
export class DeviceTokensService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}
  async createUserDeviceToken(data: CreateUserDeviceTokenDto) {
    const tokens = await this.deviceTokensRepository.find({
      where: {
        userId: data.userId,
        fcmToken: data.fcmToken ? data.fcmToken : null,
      },
    });
    tokens.forEach(async (token) => {
      token.status = DeviceTokenStatus.TERMINATED;
      token.loggedOutAt = new Date();
      await this.deviceTokensRepository.save(token);
    });
    // await this.deviceTokensRepository.update(
    //   {
    //     userId: data.userId,
    //     fcmToken: data.fcmToken ? data.fcmToken : null,
    //   },
    //   {
    //     status: DeviceTokenStatus.TERMINATED,
    //     loggedOutAt: new Date(),
    //   },
    // );
    return await this.deviceTokensRepository.save(data).catch((err) => {
      throw new BadRequestException('Error registering device token', err);
    });
  }

  async createEmployeeDeviceToken(data: CreateEmployeeDeviceTokenDto) {
    const tokens = await this.deviceTokensRepository.find({
      where: {
        employeeId: data.employeeId,
        fcmToken: data.fcmToken ? data.fcmToken : null,
      },
    });
    tokens.forEach(async (token) => {
      token.status = DeviceTokenStatus.TERMINATED;
      token.loggedOutAt = new Date();
      await this.deviceTokensRepository.save(token);
    });

    // const deviceToken = await this.deviceTokensRepository.update(
    //   {
    //     employeeId: data.employeeId,
    //     fcmToken: data.fcmToken ? data.fcmToken : null,
    //   },
    //   {
    //     status: DeviceTokenStatus.TERMINATED,
    //     loggedOutAt: new Date(),
    //   },
    // );
    return await this.deviceTokensRepository.save(data).catch((err) => {
      throw new BadRequestException('Error registering device token', err);
    });
  }

  findAll() {
    return `This action returns all deviceTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceToken`;
  }

  update(id: number, updateDeviceTokenDto: UpdateDeviceTokenDto) {
    return `This action updates a #${id} deviceToken`;
  }

  async remove(id: string) {
    return await this.deviceTokensRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error removing session!', err);
    });
  }
}
