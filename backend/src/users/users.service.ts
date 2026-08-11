import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async createGuest(): Promise<User> {
    const guestNumber = Math.floor(1000 + Math.random() * 9000);
    const user = this.usersRepo.create({
      displayName: `Guest ${guestNumber}`,
      email: `guest${guestNumber}@ablespace.app`,
      isGuest: true,
    });
    return this.usersRepo.save(user);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }
}
