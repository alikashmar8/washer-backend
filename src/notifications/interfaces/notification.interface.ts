import { NotificationType } from 'src/common/enums/notification-type.enum';

export interface NotificationData {
  readonly title: string;
  readonly body: string;
  readonly type: NotificationType;
  readonly fcmTokens: string[];
}
