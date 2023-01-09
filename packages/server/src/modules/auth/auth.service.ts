import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { Request, Response } from 'express';
import { REDIS } from '../redis/redis.constant';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly prismaService: PrismaService
  ) {}

  async profile(req: Request) {
    const user = req.user as { id: number };
    const cached = await this.redis.get(`user:${user.id}`);

    if (cached) return JSON.parse(cached);

    const puser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    if (!puser) {
      throw new InternalServerErrorException();
    }

    delete puser.password;

    const result = JSON.stringify(puser);

    await this.redis.set(`user:${user.id}`, result, 'EX', 60 * 60 * 24 * 7);

    return puser;
  }

  async validateUser(input: string, password: string) {
    const user = await this.prismaService.findByUserOrEmail(input);
    const generic = [
      {
        field: 'username_email',
        message: 'Invalid username or password',
      },
      {
        field: 'password',
        message: 'Invalid username or password',
      },
    ];

    if (!user) {
      throw new UnauthorizedException({ errors: generic });
    }

    const match = await argon.verify(user.password, password);

    delete user.password;

    if (!match) {
      throw new UnauthorizedException({ errors: generic });
    }

    return { id: user.id };
  }

  async register(
    input: { username: string; email: string; password: string },
    req: Request,
    res: Response
  ) {
    const { username, email, password } = input;
    let user;
    try {
      user = await this.prismaService.user.create({
        data: { username, email, password },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException({
          errors: error.meta.target.map((t) => ({
            field: t,
            message: `${
              t.charAt(0).toUpperCase() + t.slice(1)
            } is already taken`,
          })),
        });
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    delete user.password;

    return new Promise((resolve) => {
      req.login(user, (err) => {
        if (err) {
          resolve(false);
        }

        resolve(true);

        res.end();
      });
    });
  }

  async logout(req: Request, res: Response) {
    const user = req.user as { id: number };
    await this.redis.del(`user:${user.id}`).catch(() => {
      // empty stuff
    });
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          resolve(false);
        }

        res.clearCookie('connect.sid');

        resolve(true);
        res.end();
      });
    });
  }
}
