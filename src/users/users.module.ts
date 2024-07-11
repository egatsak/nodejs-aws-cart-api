import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { BcryptService } from 'src/common/hashing/bcrypt.service';
import { HashingService } from 'src/common/hashing/hashing.service';

@Module({
  providers: [
    UsersService,
    { provide: HashingService, useClass: BcryptService },
  ],
  exports: [UsersService],
})
export class UsersModule {}
