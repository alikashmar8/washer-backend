export class CreateNotificationDto {
    readonly title: string;
    readonly message: string;
    readonly userId?: number;
    readonly employeeId?: number;
}