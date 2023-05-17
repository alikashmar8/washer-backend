import { Test, TestingModule } from '@nestjs/testing';
import { Chats2Gateway } from './chats2.gateway';

describe('Chats2Gateway', () => {
  let gateway: Chats2Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Chats2Gateway],
    }).compile();

    gateway = module.get<Chats2Gateway>(Chats2Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
