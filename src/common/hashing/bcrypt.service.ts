import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string, salt?: number): Promise<string> {
    const genSalt = await bcrypt.genSalt(salt);
    return bcrypt.hash(data, genSalt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
