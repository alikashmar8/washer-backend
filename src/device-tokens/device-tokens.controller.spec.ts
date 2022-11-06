import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTokensController } from './device-tokens.controller';
import { DeviceTokensService } from './device-tokens.service';

describe('DeviceTokensController', () => {
  let controller: DeviceTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTokensController],
      providers: [DeviceTokensService],
    }).compile();

    controller = module.get<DeviceTokensController>(DeviceTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
