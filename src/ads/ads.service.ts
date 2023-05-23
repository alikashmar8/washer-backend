import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';
import * as path from 'path';
import { AppService } from 'src/app.service';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad) private adsRepository: Repository<Ad>,
    private appsService: AppService,
  ) {}
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
    const ad = await this.findOneByIdOrFail(id);
    const image = ad.image;

    return await this.adsRepository
      .delete(id)
      .catch((err) => {
        throw new BadRequestException('Error deleting ad!', err);
      })
      .then(async () => {
        if (image) {
          const imagePath = path.join(process.cwd(), image);
          console.log('Image path:', imagePath);
          try {
            await this.appsService.deleteFile(imagePath);
          } catch (err) {
            console.error(err);
          }
        }
      });
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.adsRepository
      .findOneOrFail({ where: { id: id }, relations: relations })
      .catch((err) => {
        throw new BadRequestException('Ad not found!', err);
      });
  }

  async updateImage(id: string, newImage?: Express.Multer.File) {
    //TODO to handle err in newImage
    return await this.appsService.updateFile(
      id,
      'image',
      newImage,
      this.adsRepository
    );
   
  }
  

}
