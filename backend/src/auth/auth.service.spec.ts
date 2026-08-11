import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = { createGuest: jest.fn() };
    jwtService = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('creates a guest user and returns a signed token with a safe user payload', async () => {
    usersService.createGuest!.mockResolvedValue({
      id: 'user-1',
      displayName: 'Guest 4213',
      email: 'guest4213@ablespace.app',
      title: null,
      username: null,
      isGuest: true,
    });
    jwtService.signAsync!.mockResolvedValue('signed.jwt.token');

    const result = await service.loginAsGuest();

    expect(usersService.createGuest).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      name: 'Guest 4213',
    });
    expect(result).toEqual({
      accessToken: 'signed.jwt.token',
      user: {
        id: 'user-1',
        displayName: 'Guest 4213',
        email: 'guest4213@ablespace.app',
        title: null,
        username: null,
        isGuest: true,
      },
    });
  });
});
