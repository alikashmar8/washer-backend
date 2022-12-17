import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
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

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  async remove(id: string) {
    return await this.vehiclesRepository.delete(id).catch(() => {
      throw new BadRequestException('Error deleting vehicle');
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
