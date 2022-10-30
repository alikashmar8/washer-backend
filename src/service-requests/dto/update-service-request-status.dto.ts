import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty
} from 'class-validator';
import { RequestStatus } from 'src/common/enums/request-status.enum';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({ enum: RequestStatus })
  @IsNotEmpty()
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
