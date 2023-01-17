import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const GLOBAL_PREFIX = 'api';
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
  });
  app.use(
    helmet({
      xssFilter: true,
      hidePoweredBy: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
        },
      },
    })
  );
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`,
    'Bootstrap'
  );
}

bootstrap().then(() => {});
