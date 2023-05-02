import { Currency } from 'src/common/enums/currency.enum';
export class CreateWalletDto {
  balance: number;
  currency: Currency;
}
