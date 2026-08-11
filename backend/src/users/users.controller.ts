import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthedRequest extends Request {
  user: { userId: string };
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() req: AuthedRequest) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  updateMe(@Body() dto: UpdateProfileDto, @Req() req: AuthedRequest) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }
}
