import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    this.logger.log(`Database URL: ${process.env.DATABASE_URL}`);
  }

  async onModuleInit() {
    await this.$connect();
  }
}