import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchesRepository: Repository<Branch>,
  ) {}
  async create(data: CreateBranchDto) {
    return await this.branchesRepository.save(data).catch(() => {
      throw new BadRequestException('Error adding a branch');
    });
  }

  async findAll(filters: any, relations?: string[]) {
    const res = await this.branchesRepository.findAndCount({
      relations,
    });
    return {
      data: res[0],
      count: res[1],
    };
  }

  async findByIdOrFail(id: string, relations?: string[]) {
    return await this.branchesRepository
      .findOneOrFail({ where: { id: id }, relations: relations })
      .catch((err: any) => {
        throw new BadRequestException('Branch not found!');
      });
  }

  async update(id: string, data: UpdateBranchDto) {
    return await this.branchesRepository
      .update(id, {
        description: data.description,
        isActive: data.isActive,
        coverageArea: data.coverageArea,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error Updating Branch', err);
      });
  }

  async remove(id: string) {
    return await this.branchesRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error deleting branch');
    });
  }
}
