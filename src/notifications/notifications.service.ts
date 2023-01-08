import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationData } from './interfaces/notification.interface';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  async notify(notificationData: NotificationData): Promise<void> {
    notificationData.fcmTokens.forEach(function(token) {
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
        .then(function(resp) {
          console.log('Successfully sent message:');
        })
        .catch(err => {
          console.error('Error sending notification')
          console.error(err)
        });
    });
  }
}
