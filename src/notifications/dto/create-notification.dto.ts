import { NotificationType } from "src/common/enums/notification-type.enum";

export class CreateNotificationDto {
    readonly title: string;
    readonly message: string;
    readonly userId?: number;
    readonly employeeId?: number;
    readonly type?: NotificationType;
    readonly fcmTokens?: string[];

}