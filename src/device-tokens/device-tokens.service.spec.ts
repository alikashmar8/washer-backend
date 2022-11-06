import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokensService } from './device-tokens.service';

describe('DeviceTokensService', () => {
  let service: DeviceTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceTokensService],
    }).compile();

    service = module.get<DeviceTokensService>(DeviceTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
