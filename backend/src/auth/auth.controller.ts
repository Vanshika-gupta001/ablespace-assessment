import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @ApiOperation({
    summary: 'Create a guest session',
    description:
      'Creates a new anonymous user and returns a JWT scoped to it. No credentials required.',
  })
  loginAsGuest() {
    return this.authService.loginAsGuest();
  }
}
