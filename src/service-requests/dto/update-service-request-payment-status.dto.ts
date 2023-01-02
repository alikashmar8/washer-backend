import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateServiceRequestPaymentStatusDto {
  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  isPaid: boolean;
}
