import { Injectable } from '@nestjs/common';
import 'firebase/database';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  async findAll(): Promise<Notification[]> {
    const notificationsRef = firebase.database().ref('notifications');
    const snapshot = await notificationsRef.once('value');
    const notifications = snapshot.val();
    return Object.keys(notifications).map((key) => ({
      id: key,
      ...notifications[key],
    }));
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
}
