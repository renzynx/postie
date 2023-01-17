import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request as ERQ, Response as ERP } from 'express';
import { ProtectedGuard } from '../auth/guards/protected.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(ProtectedGuard)
  @Put('change-password')
  async changePassword(
    @Body() data: { old: string; password: string },
    @Request() req: ERQ
  ) {
    return this.userService.changePassword(req, data);
  }

  @UseGuards(ProtectedGuard)
  @Get('verify/email')
  async sendMail(@Request() req: ERQ, @Response() res: ERP) {
    return this.userService.sendVerificationEmail(req, res);
  }

  @Get('verify/email/:token')
  async verifyEmail(@Param('token') token: string, @Response() res: ERP) {
    return this.userService.verifyEmail(token, res);
  }
}
