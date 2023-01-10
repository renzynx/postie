import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(PrismaService.name);

  constructor() {
    super();

    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      // ... which logs the time any query takes
      this.logger.debug(
        `Query ${params.model}.${params.action} took ${after - before}ms`
      );
      return result;
    });

    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      if (params.model === 'User') {
        if (
          params.action === 'create' ||
          (params.action === 'update' && params.args.data.password)
        ) {
          params.args.data.password = await argon.hash(
            params.args.data.password
          );
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async findByUserOrEmail(input: string) {
    const data = input.includes('@') ? { email: input } : { username: input };
    return this.user.findUnique({ where: data });
  }

  async findUserById(id: number) {
    return this.user.findUnique({ where: { id } });
  }
}
