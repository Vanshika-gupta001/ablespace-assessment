import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginAsGuest() {
    const user = await this.usersService.createGuest();
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      name: user.displayName,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        title: user.title,
        username: user.username,
        isGuest: user.isGuest,
      },
    };
  }
}
