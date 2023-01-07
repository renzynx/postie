import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Payload } from '@postie/shared-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async profile(req: Request) {
    const cookies = req.cookies;

    const token = cookies?.jwt;

    if (!token) throw new UnauthorizedException();

    const session = await this.prismaService.session.findUnique({
      where: { sid: token },
    });

    if (!session) throw new UnauthorizedException();

    if (session.expire < new Date()) {
      await this.prismaService.session.delete({ where: { sid: token } });
      throw new UnauthorizedException();
    }

    return req.user;
  }

  async refresh(req: Request) {
    const cookies = req.cookies;

    const token = cookies?.jwt;

    if (!token) throw new UnauthorizedException();

    let payload: Payload;

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        issuer: 'postie',
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.findUserById(payload.sub);

    if (!user) throw new UnauthorizedException();

    const newPayload: Payload = {
      user: {
        username: user.username,
        email: user.email,
      },
      sub: user.id,
      iss: 'postie',
      iat: Date.now(),
    };

    const access_token = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '15m',
    });

    return { access_token };
  }

  async validateUser(input: string, password: string) {
    const user = await this.prismaService.findByUserOrEmail(input);
    if (!user) return null;
    const match = await argon.verify(user.password, password);
    delete user.password;
    return match ? user : null;
  }

  async login(req: Request, res: Response) {
    const user = req.user as User;

    const payload: Payload = {
      user: {
        username: user.username,
        email: user.email,
      },
      sub: user.id,
      iss: 'postie',
      iat: Date.now(),
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    await this.prismaService.session.create({
      data: {
        userId: user.id,
        sid: refresh_token,
        expire: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        userAgent: req.headers['user-agent'] ?? 'Unknown',
      },
    });

    res
      .cookie('jwt', refresh_token, {
        httpOnly: true,
        secure: process.env.USE_HTTPS === 'true',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .json({ access_token })
      .end();
  }

  async register(
    input: { username: string; email: string; password: string },
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
            message: `${t.charAt(0).toUpperCase() + t.slice(1)} already taken`,
          })),
        });
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    return this.login(user, res);
  }

  async logout(req: Request, res: Response) {
    const jwt = req.cookies['jwt'] as string;
    if (!jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.USE_HTTPS === 'true',
      sameSite: 'none',
    });
    return res.json({ message: 'Logged out' });
  }
}
