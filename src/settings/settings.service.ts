import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private settingsRepository: Repository<Setting>,
  ) {}
  async findByKey(key: string) {
    return await this.settingsRepository.findOne({
      where: {
        key,
      },
    });
  }
  create(createSettingDto: CreateSettingDto) {
    return 'This action adds a new setting';
  }

  async findAll() {
    return await this.settingsRepository.find();
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    return await this.settingsRepository.update(id, updateSettingDto)
  }
}
