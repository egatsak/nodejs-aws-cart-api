import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: Repository<User>) {}

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User id=${userId} not found.`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }
}
