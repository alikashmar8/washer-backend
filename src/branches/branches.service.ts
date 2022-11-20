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

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  async remove(id: string) {
    return await this.branchesRepository.delete(id).catch((err) => {
      throw new BadRequestException('Error deleting branch');
    });
  }
}
