import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Request as ERQ, Response as ERP } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.guard';
import { ProtectedGuard } from './guards/protected.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ProtectedGuard)
  @Get('profile')
  async profile(@Request() req: ERQ) {
    return this.authService.profile(req);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    return { message: 'Logged in' };
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
    @Response() res: ERP,
    @Request() req: ERQ
  ) {
    return this.authService.register(body, req, res);
  }

  @UseGuards(ProtectedGuard)
  @Post('logout')
  async logout(@Request() req: ERQ, @Response() res: ERP) {
    return this.authService.logout(req, res);
  }
}
