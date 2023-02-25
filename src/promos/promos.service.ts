import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { Promo } from './entities/promo.entity';

@Injectable()
export class PromosService {
  constructor(
    @InjectRepository(Promo)
    private promosRepository: Repository<Promo>,
  ) {}

  async create(createPromoDto: CreatePromoDto) {
    const promo = await this.promosRepository.findOne({
      where: { code: createPromoDto.code, userId: createPromoDto.userId },
    });
    if (promo) {
      throw new BadRequestException('promo code already exits!');
    }

    return await this.promosRepository.save(createPromoDto).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating promo code!');
    });
  }

  async findAll(queryParams: {
    take: number;
    skip: number;
    isActive: boolean;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let query: any = this.promosRepository
      .createQueryBuilder('promo')
      .innerJoinAndSelect('promo.user', 'user');

    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      query = query.where('promo.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }
    query = await query.skip(skip).take(take).getManyAndCount();
    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOneByIdOrFail(id: string) {
    return await this.promosRepository.findOneByOrFail({ id }).catch((err) => {
      throw new BadRequestException('promo code not found!', err);
    });
  }

  async findOne(code: string, relations?: string[]): Promise<Promo> {
    return await this.promosRepository.findOne({
      where: { code: code },
      relations,
    });
  }

  async update(id: string, updatePromoDto: UpdatePromoDto) {
    return await this.promosRepository
      .update(id, updatePromoDto)
      .catch((err) => {
        throw new BadRequestException('Error updating promo code!', err);
      });
  }

  async remove(id: string) {
    return await this.promosRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error deleting promo code!', err);
    });
  }

  async checkValidity(userId: string, code: string): Promise<boolean> {
    if (!code) return false;

    const promoCheck = await this.promosRepository.findOne({
      where: {
        code,
        userId,
      },
    });

    if (!promoCheck) return false;

    if (!promoCheck.isActive) return false;

    if (promoCheck.numberOfUsage >= promoCheck.limit) return false;

    if (promoCheck.expiryDate && promoCheck.expiryDate <= new Date())
      return false;

    return true;
  }

  async findPromo(code: string) {
    const promo = await this.promosRepository
      .findOne({
        where: {
          code,
          // userId,
        },
      })
      .catch((err) => {
        throw new BadRequestException("promo can't be found!", err);
      });
    return promo;
  }

  async consumePromo(
    queryRunner: QueryRunner,
    userId: string,
    promoCode: string,
  ) {
    try {
      const promo = await queryRunner.manager.findOne(Promo, {
        where: [{ userId, code: promoCode }],
      });

      if (promo.numberOfUsage >= promo.limit) {
        throw new BadRequestException('Number of usage exceeds limit!');
      } else {
        await queryRunner.manager.update(
          Promo,
          { id: promo.id },
          { numberOfUsage: promo.numberOfUsage + 1 },
        );
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error finding or updating promo!');
    }
  }
}
