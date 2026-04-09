import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: InstanceType<typeof PrismaClient>;

  constructor(private configService: ConfigService) {
    const adapter = new PrismaMariaDb(
      this.configService.getOrThrow<string>('DATABASE_URL'),
    );
    this.client = new PrismaClient({ adapter });
  }

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.client.$connect();
    try {
      await this.client.$queryRawUnsafe('SELECT 1');
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get user() {
    return this.client.user;
  }

  get user_auth() {
    return this.client.user_auth;
  }

  get refresh_token() {
    return this.client.refresh_token;
  }

  get account() {
    return this.client.account;
  }

  get transaction() {
    return this.client.transaction;
  }

  get category() {
    return this.client.category;
  }

  get $transaction() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.client.$transaction.bind(this.client);
  }
}
