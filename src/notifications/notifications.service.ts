import { BadRequestException, Injectable } from '@nestjs/common';
import 'firebase/database';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationData } from './interfaces/notification.interface';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto): Promise<void> {
    const notification = this.notificationRepository.create(createNotificationDto);
    await this.notificationRepository.save(notification);

    const notificationData: NotificationData = {
      title: notification.title,
      body: notification.body,
      type: notification.type,
      fcmTokens: notification.fcmTokens,
    };

    this.notify(notificationData);
  }

  async findAll(): Promise<Notification[]> {

    const snapshot = await admin.database().ref('notifications').once('value');


    const notifications: Notification[] = snapshot.val();
    return Object.keys(notifications).map(key => ({
      id: key,
      ...notifications[key],
    }));
  }


  async findOne(id: number): Promise<Notification> {
    // query Firebase for the notification with the specified id
    const snapshot = await admin.database().ref(`notifications/${id}`).once('value');

    // parse snapshot data into a Notification object
    const notification: Notification = snapshot.val();
    return notification;
  }

  /*
  
  .findOneOrFail({
          where: { id },
          relations,
        })
        .catch((err) => {
          throw new BadRequestException('Category not found!', err);
        });*/


  async updateIsRead(id: number): Promise<void> {
    const notification = await this.notificationRepository
      .findOneOrFail({
        where: { id },

      })
      .catch((err) => {
        throw new BadRequestException('Category not found!', err);
      });

    notification.isRead = true;

    await this.notificationRepository.save(notification);

  }


  async remove(id: number): Promise<void> {

    const notification = await this.notificationRepository.findOne(id);


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
        })
        .catch(err => {
          console.error('Error sending notification')
          console.error(err)
        });
    });
  }
}
