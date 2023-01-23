import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
    readonly title?: string;
    readonly message?: string;
    readonly userId?: string;
    readonly employeeId?: string;
}
