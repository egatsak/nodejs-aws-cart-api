import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from 'src/common/hashing/bcrypt.service';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    { provide: HashingService, useClass: BcryptService },
  ],
  exports: [UsersService],
})
export class UsersModule {}
