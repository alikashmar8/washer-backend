import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';

@Injectable()
export class CreditCardsService {
  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.creditCardsRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Credit Card not found!');
      });
  }
  constructor(
    @InjectRepository(CreditCard)
    private creditCardsRepository: Repository<CreditCard>,
  ) {}
  async create(data: CreateCreditCardDto, currentUser: User) {
    let card = await this.creditCardsRepository.findOne({
      where: { userId: currentUser.id, cardNumber: data.cardNumber },
    });

    if (card)
      throw new HttpException('Card already exists', HttpStatus.BAD_REQUEST);

    card = this.creditCardsRepository.create({
      ...data,
      user: currentUser,
    });
    await this.creditCardsRepository.save(card);

    return card;
  }

  findAll() {
    return `This action returns all creditCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditCard`;
  }

  update(id: number, updateCreditCardDto: UpdateCreditCardDto) {
    return `This action updates a #${id} creditCard`;
  }

  async remove(id: string) {
    return await this.creditCardsRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting card!');
    });
  }
}
