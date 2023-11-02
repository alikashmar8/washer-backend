import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private appsService: AppService,
  ) {}

  async create(data: CreateVehicleDto) {
    return await this.vehiclesRepository.save(data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error adding vehicle!');
    });
  }

  async findAll(queryParams: { userId?: string }) {
    let query = this.vehiclesRepository.createQueryBuilder('vehicle');

    if (queryParams.userId) {
      query = query.where('vehicle.userId = :uid', { uid: queryParams.userId });
    }

    return await query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const newImage = updateVehicleDto.photo;
    delete updateVehicleDto.photo;
    await this.vehiclesRepository
      .update(id, updateVehicleDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating vehicle!');
      })
      .then(async () => {
        if (newImage)
          await this.appsService.updateFile(
            id,
            'photo',
            newImage,
            this.vehiclesRepository,
          );
      });

    return { success: true };
  }

  async remove(id: string) {
    const vehicle = await this.findOneByIdOrFail(id);
    const photo = vehicle.photo;

    return await this.vehiclesRepository
      .softDelete(id)
      .catch((err) => {
        throw new BadRequestException('Error deleting vehicle!', err);
      })
      .then(async (data) => {
        return data;
        // TODO: check if we need to keep photo after soft delete.
        // if (photo) {
        //   const imagePath = path.join(process.cwd(), photo);
        //   console.log('Image path:', imagePath);
        //   try {
        //     await this.appsService.deleteFile(imagePath);
        //   } catch (err) {
        //     console.error(err);
        //   }
        // }
      });
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.vehiclesRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        throw new BadRequestException('Vehicle not found!', err);
      });
  }
}
