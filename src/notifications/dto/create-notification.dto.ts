import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "src/common/enums/notification-type.enum";
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    body: string;

    @ApiProperty()
    @IsOptional()
    userId?: string;

    @ApiProperty()
    @IsOptional()
    employeeId?: string;

    @ApiProperty()
    @IsOptional()
    type?: NotificationType;

    // @ApiProperty()
    // @IsOptional()
    // fcmTokens?: string[];
}


