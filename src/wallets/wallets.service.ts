import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}
  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  async findOneByIdOrFail(id: string) {
    return await this.walletRepository
      .findOneOrFail({
        where: { id },
      })
      .catch((err) => {
        throw new BadRequestException('Error wallet not found');
      });
  }

  async update(id: string, updateWalletDto: UpdateWalletDto) {
    await this.walletRepository.update(id, updateWalletDto).catch((err) => {
      throw new BadRequestException('Error updating wallet');
    });
    return await this.findOneByIdOrFail(id);
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
