import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWalletDto {
  @IsNotEmpty()
  @IsNumber()
  balance: number;
}
