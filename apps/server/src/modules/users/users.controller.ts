import { Controller, Get, Param, Request, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request as ERQ, Response as ERP } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('verify/email')
  async sendMail(@Request() req: ERQ, @Response() res: ERP) {
    return this.userService.sendVerificationEmail(req, res);
  }

  @Get('verify/email/:token')
  async verifyEmail(@Param('token') token: string, @Response() res: ERP) {
    return this.userService.verifyEmail(token, res);
  }
}
