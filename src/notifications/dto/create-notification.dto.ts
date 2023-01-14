import { NotificationType } from "src/common/enums/notification-type.enum";

export class CreateNotificationDto {
    readonly title: string;
    readonly message: string;
    readonly body: string;
    readonly userId?: string;
    readonly employeeId?: string;
    readonly type?: NotificationType;
    readonly fcmTokens?: string[];

}