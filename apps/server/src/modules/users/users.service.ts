import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { REDIS } from '../redis/redis.constant';
import { Redis } from 'ioredis';
import { randomBytes } from 'crypto';
import { GENERAL_TEMPLATE } from '../mail/mail.constant';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async changePassword(req: Request, data: { old: string; password: string }) {
    const sessionUser = req.user as { id: number };

    const user = await this.prismaService.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      throw new InternalServerErrorException();
    }

    const match = await argon.verify(user.password, data.old);

    if (!match) {
      throw new BadRequestException({
        errors: [
          {
            field: 'old',
            message: 'Old password is incorrect',
          },
        ],
      });
    }

    //! password will be hashed in prisma middleware
    //? /apps/server/src/modules/prisma/prisma.service.ts
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: data.password },
    });

    return true;
  }

  async sendVerificationEmail(req: Request, res: Response) {
    const sess = req.user as { id: number };

    const user = await this.prismaService.user.findUnique({
      where: { id: sess.id },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user?.verified) {
      return res.type('txt').send('Account already verified.');
    }

    const token = randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '')
      .replace(/\//g, '')
      .replace(/=/g, '');

    await this.redis.set(`email:${token}`, user.id, 'EX', 60 * 60 * 24);

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const link = `${protocol}://${req.get(
      'host'
    )}/api/users/verify/email/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: GENERAL_TEMPLATE,
      context: {
        link,
        username: user.username,
        action: 'Verify your email',
        paragraph:
          'Please verify your email by clicking the button above. This link will expire in 24 hours.',
        footer:
          'If you did not create an account, please ignore this e-mail and no changes will be made to your account.',
      },
    });

    return res.type('txt').send('Email sent.');
  }

  async verifyEmail(token: string, res: Response) {
    if (!token) {
      throw new NotFoundException();
    }

    const id = await this.redis.get(`email:${token}`);

    if (!id) {
      throw new NotFoundException();
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new InternalServerErrorException();
    }

    if (user?.verified) {
      return res.type('txt').send('Account already verified.');
    }

    await Promise.all([
      this.prismaService.user.update({
        where: { id: user.id },
        data: {
          verified: new Date(Date.now()),
        },
      }),
      this.redis.del(`email:${token}`),
      this.mailerService.sendMail({
        to: user.email,
        subject: 'Email verified',
        template: GENERAL_TEMPLATE,
        context: {
          link: process.env.CORS_ORIGIN,
          username: user.username,
          action: 'Email verified',
          paragraph: 'Your email has been verified.',
          footer: '',
        },
      }),
    ]);

    return res.type('txt').send('Email verified.');
  }
}
