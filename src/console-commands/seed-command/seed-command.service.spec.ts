import { Test, TestingModule } from '@nestjs/testing';
import { SeedCommandService } from './seed-command.service';

describe('SeedCommandService', () => {
  let service: SeedCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedCommandService],
    }).compile();

    service = module.get<SeedCommandService>(SeedCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
