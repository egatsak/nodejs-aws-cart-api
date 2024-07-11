import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User id=${userId} not found.`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    const hashedPassword = await this.hashingService.hash(password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }
}
