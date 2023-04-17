import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { ServiceType } from './entities/service-type.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { EXCHANGE_RATE } from 'src/common/constants';
import path from 'path';
import { AppService } from 'src/app.service';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypesRepository: Repository<ServiceType>,
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
    private appsService: AppService,
  ) {}

  async create(data: CreateServiceTypeDto) {
    return await this.serviceTypesRepository.save(data).catch((err) => {
      throw new BadRequestException('Error creating type!', err);
    });
  }

  async findAll(queryParams: {
    take?: any;
    skip?: any;
    isActive?: boolean;
    serviceCategoryId?: string;
    search?: string;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;
    let isFirstWhere = true;
    let query: any = this.serviceTypesRepository
      .createQueryBuilder('type')
      .leftJoinAndSelect('type.category', 'category');

    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      isFirstWhere = false;
      query = query.where('type.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }

    if (queryParams.search) {
      const innerQuery = new Brackets((qb) => {
        qb.where('type.name like :name', {
          name: `%${queryParams.search}%`,
        })
          .orWhere('type.icon like :name', {
            name: `%${queryParams.search}%`,
          })
          .orWhere('category.name like :name', {
            name: `%${queryParams.search}%`,
          });
      });
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(innerQuery);
      } else {
        query = query.andWhere(innerQuery);
      }
    }

    if (queryParams.serviceCategoryId) {
      const queryString = 'type.serviceCategoryId = ' + queryParams.serviceCategoryId;
      if (isFirstWhere) {
        isFirstWhere = false;
        query = query.where(queryString);
      } else {
        query = query.andWhere(queryString);
      }
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    const exchangeRateSetting: Setting = await this.settingsRepository.findOneOrFail({
      where: {
        key: EXCHANGE_RATE
      }
    }).catch( err => {
      throw new BadRequestException('Error calculating prices', err);
    })
    const exchangeRate = Number(exchangeRateSetting.value);
    
    query[0].forEach((element) => {
      element.priceLBP = element.price * exchangeRate;
    });

    return {
      data: query[0],
      count: query[1],
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceType`;
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.serviceTypesRepository
      .findOneOrFail({
        where: { id },
        relations: relations,
      })
      .catch((err) => {
        throw new BadRequestException('Service Types not found!', err);
      });
  }

  async update(id: string, data: UpdateServiceTypeDto) {
    return await this.serviceTypesRepository.update(id, data).catch((err) => {
      throw new BadRequestException('Error updating service type', err);
    });
  }

  async remove(id: string) {
    const service = await this.findOneByIdOrFail(id);
    const icon = service.icon;

    return await this.serviceTypesRepository
      .delete(id)
      .catch((err) => {
        throw new BadRequestException('Error deleting service!', err);
      })
      .then(async () => {
        if (icon) {
          const imagePath = path.join(process.cwd(), icon);
          console.log('Image path:', imagePath);
          try {
            await this.appsService.deleteFile(imagePath);
          } catch (err) {
            console.error(err);
          }
        }
      });
  }

  async updateImage(id: string, newImage?: Express.Multer.File) {
    //TODO to handle err in newImage
    return await this.appsService.updateFile(
      id,
      'image',
      newImage,
      this.serviceTypesRepository
    );
  }
}
