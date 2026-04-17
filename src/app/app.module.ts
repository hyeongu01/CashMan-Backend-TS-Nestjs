import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_EXPIRES_IN } from '@common/constants/auth';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import { CategoriesModule } from '@modules/categories/categories.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: TOKEN_EXPIRES_IN },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [createKeyv(config.getOrThrow<string>('REDIS_URL'))],
        ttl: 60 * 1000,
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
