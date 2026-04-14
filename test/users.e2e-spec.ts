import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { PrismaService } from '@infra/prisma/prisma.service';

const mockupUser: LoginDto = {
  provider: 'NAVER',
  providerId: 'test-001',
  name: 'Test User 001',
  birthDate: new Date().toISOString(),
}

describe('Users Domain', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist: true}));
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();

    const authService: AuthService = app.get(AuthService);
    const result = await authService.login(mockupUser);
    accessToken = result.data.accessToken;
  });

  afterAll(async () => {
    const prismaService = app.get(PrismaService);
    await prismaService.user.deleteMany({
      where: { auths: { some: { providerId: 'test-001' } } },
    });

    await app.close();
  });

  describe('Get /users/me', () => {
    it('getItem Success', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data).toMatchObject({
        id: expect.any(String),
        name: mockupUser.name,
        birthDate: expect.any(String),
      });
      expect(res.body.data).toHaveProperty('currency');
      expect(res.body.data).toHaveProperty('timezone');
      expect(res.body.data).not.toHaveProperty('createdAt');
      expect(res.body.data).not.toHaveProperty('deletedAt');
      expect(res.body.data).not.toHaveProperty('updatedAt');
    });

    it('should be reject Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer sdf`)
        .expect(401);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('statusCode');
      expect(res.body).toHaveProperty('timestamp');
    })
  })

  describe('Put /users/me', () => {
    it('update success', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/me')
        .send({name: 'dd'})
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toBeDefined()
      expect(res.body.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data', {});
    })
  })
})
