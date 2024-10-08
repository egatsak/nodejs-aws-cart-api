import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

import { AuthService } from '../auth.service';
import { UserResponse } from 'src/users/users.interface';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, pass: string): Promise<UserResponse> {
    const user = await this.authService.validateUser(username, pass);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  /* async validate(username: string, pass: string): Promise<any> {
    const user = this.authService.validateUser(username, pass);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    return result;
  } */
}
