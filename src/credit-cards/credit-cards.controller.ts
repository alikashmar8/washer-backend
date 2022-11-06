import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { CreditCardValidationPipe } from './pipes/credit-card-validation.pipe';

@ApiTags('Credit Cards')
@UsePipes(new ValidationPipe())
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @UseGuards(new IsUserGuard())
  @Post()
  async create(
    @Body(new CreditCardValidationPipe()) data: CreateCreditCardDto,
    @CurrentUser() user: User,
  ) {
    return await this.creditCardsService.create(data, user);
  }

  // @Get()
  // findAll() {
  //   return this.creditCardsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.creditCardsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCreditCardDto: UpdateCreditCardDto,
  // ) {
  //   return this.creditCardsService.update(+id, updateCreditCardDto);
  // }

  @UseGuards(new IsUserGuard())
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const card = await this.creditCardsService.findOneByIdOrFail(id);
    if (card.userId != user.id)
      throw new UnauthorizedException(
        'You are not allowed to perform this action.',
      );
    return await this.creditCardsService.remove(id);
  }
}
