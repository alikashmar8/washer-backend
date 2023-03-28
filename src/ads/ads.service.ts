import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private adsRepository: Repository<Ad>) {}
  async create(createAdDto: CreateAdDto) {
    return await this.adsRepository.save(createAdDto).catch((error) => {
      console.log(error);
      throw new BadRequestException('Error adding ad!', error);
    });
  }

  async findAll(queryParams: {
    take: number;
    skip: number;
    isActive: boolean;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let query: any = this.adsRepository.createQueryBuilder('ad');
    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      query = query.where('ad.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }
    query = await query.skip(skip).take(take).getManyAndCount();
    return {
      data: query[0],
      count: query[1],
    };
  }

  async update(id: string, data: UpdateAdDto) {
    return await this.adsRepository.update(id, data).catch((err) => {
      throw new BadRequestException('Error updating ad!', err);
    });
  }

  async remove(id: string) {
    return await this.adsRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error deleting ad!', err);
    });
  }

  async findOneByIdOrFail(id: string) {
    return await this.adsRepository.findOneByOrFail({ id }).catch((err) => {
      throw new BadRequestException('Ad not found!', err);
    });
  }

  async deleteImage(id: string, imagePath: string) {
    const ad = await this.findOneByIdOrFail(id);
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }
    if (ad.image) {
      try {
        if (fs.existsSync(imagePath)) {
          // file exists, delete it
          console.log('Checked imagePath');
          fs.unlinkSync(imagePath);
        } else {
          console.log(`File does not exist: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image file: ${err.message}`);
      }
    }
  }
  
}
