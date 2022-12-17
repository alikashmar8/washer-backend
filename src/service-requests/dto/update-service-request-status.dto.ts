import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    Length,
    ValidateIf
} from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({ enum: RequestStatus })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;
  
  @ApiProperty({ required: false, nullable: true})
  @ValidateIf(o => o.status === RequestStatus.CANCELLED)
  @IsNotEmpty()
  @Length(10, 250)
  cancelReason?: string;
}
