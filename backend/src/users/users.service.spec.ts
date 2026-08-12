import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: { create: jest.Mock; save: jest.Mock; findOneBy: jest.Mock };

  beforeEach(async () => {
    repo = { create: jest.fn(), save: jest.fn(), findOneBy: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('creates a guest user with an auto-generated display name', async () => {
    repo.create.mockImplementation((data) => data);
    repo.save.mockImplementation((data) =>
      Promise.resolve({ id: 'u1', ...data }),
    );

    const user = await service.createGuest();

    expect(user.isGuest).toBe(true);
    expect(user.displayName).toMatch(/^Guest \d{4}$/);
  });
});
