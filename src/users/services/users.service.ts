import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ name: username });

    /*     if (!user) {
      throw new NotFoundException(`User name=${username} not found.`);
    } */

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    const hashedPassword = await this.hashingService.hash(password);

    const user = this.userRepository.create({
      ...createUserDto,
      // password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }
}
