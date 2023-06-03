import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationData } from './interfaces/notification.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(DeviceToken)
    private readonly deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  async createAndNotify(data: CreateNotificationDto): Promise<void> {
    const notification = this.notificationRepository.create(data);
    await this.notificationRepository.save(notification);

    const fcmTokens = (
      await this.deviceTokensRepository.find({
        where: {
          userId: data.userId,
          employeeId: data.employeeId,
          status: DeviceTokenStatus.ACTIVE,
          isMobile: true,
          loggedOutAt: null,
          fcmToken: Not(IsNull()), // Filter out null fcmTokens
        },
      })
    ).map((deviceToken) => deviceToken.fcmToken);

    const notificationData: NotificationData = {
      title: notification.title,
      body: notification.body,
      type: data.type,
      fcmTokens: fcmTokens,
    };

    this.notify(notificationData);

    return;
  }

  async findAll(filters: { userId?: string; employeeId?: string }) {
    return await this.notificationRepository.find({
      where: filters,
    });
  }

  async findOne(id: string, relations?: string[]): Promise<Notification> {
    return await this.notificationRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findOneOrFail(id: string, relations?: string[]): Promise<Notification> {
    return await this.notificationRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Notification not found!', err);
      });
  }

  async updateIsRead(id: string) {
    return await this.notificationRepository.update(id, {
      isRead: true,
    });
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOneOrFail(id);
    await this.notificationRepository.remove(notification);
  }

  async notify(notificationData: NotificationData): Promise<void> {
    notificationData.fcmTokens.forEach(function (token) {
      const notificationMessage: admin.messaging.Message = {
        token,
        data: {
          type: notificationData.type,
        },
        notification: {
          title: notificationData.title,
          body: notificationData.body,
        },
      };

      admin
        .messaging()
        .send(notificationMessage)
        .then(function (resp) {
          console.log('Successfully sent message:');
          console.log(resp);
        })
        .catch((err) => {
          console.error('Error sending notification');
          console.error(err);
        });
    });
  }
}
