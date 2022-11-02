import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { plainToClass } from 'class-transformer';
  import * as creditCardType from 'credit-card-type';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
  
  
  @Injectable()
  export class CreditCardValidationPipe implements PipeTransform {
    async transform(data: CreateCreditCardDto, { metatype }: ArgumentMetadata) {
      if (!metatype || !this.toValidate(metatype)) {
        return data;
      }
  
      if (!data || !data.cardNumber)
        throw new BadRequestException('Validation failed, some data is missing');
  
      const card_number_type = creditCardType(data.cardNumber).map(
        card => card.type,
      )[0];
  
      if (!card_number_type) throw new BadRequestException('Invalid card number');
  
      const entityClass = plainToClass(CreateCreditCardDto, data);
      const errors = await validate(entityClass);
  
      if (errors.length > 0) {
        throw new BadRequestException('Validation failed');
      }
      return entityClass;
    }
  
    private toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
  }
  