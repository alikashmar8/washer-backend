import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateCreditCardDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  cardNumber: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  cvcNumber: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ type: Date })
  expiryDate: Date;
}
