import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PostsModule } from './modules/posts/posts.module';
import { REDIS } from './modules/redis/redis.constant';
import { RedisModule } from './modules/redis/redis.module';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PostsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly configService: ConfigService
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({
            client: this.redis,
            logErrors: true,
            disableTouch: true,
          }),
          secret: this.configService.get<string>('SESSION_SECRET'),
          saveUninitialized: false,
          resave: false,
          cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            httpOnly: true,
            sameSite: 'lax',
            secure: this.configService.get<string>('NODE_ENV') === 'production',
          },
        }),
        passport.initialize(),
        passport.session()
      )
      .forRoutes('*');
  }
}
