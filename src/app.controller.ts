import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { BasicAuthGuard } from './auth/guards/bacis-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get(['', 'ping'])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Request() req) {
    const token = this.authService.login(req.user, 'basic');

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...token,
      },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
