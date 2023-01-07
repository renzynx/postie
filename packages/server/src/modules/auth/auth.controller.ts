import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ERQ, Response as ERP } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Request() req: ERQ) {
    return this.authService.profile(req);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: ERQ, @Response() res: ERP) {
    return this.authService.login(req, res);
  }

  @Get('refresh')
  async refresh(@Request() req: ERQ) {
    return this.authService.refresh(req);
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
    @Response() res: ERP
  ) {
    return this.authService.register(body, res);
  }

  @Post('logout')
  async logout(@Request() req: ERQ, @Response() res: ERP) {
    return this.authService.logout(req, res);
  }
}
