import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Cron('0 0 0 * * *')
  async deleteSessions() {
    this.logger.log('Deleting expired sessions');
    try {
      await this.prismaService.session.deleteMany({
        where: {
          expire: {
            lt: new Date(),
          },
        },
      });
      this.logger.log('Deleted expired sessions');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
