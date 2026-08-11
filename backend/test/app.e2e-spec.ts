import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// Full-stack integration test: boots the real Nest app against an
// in-memory sql.js database so no external services are required.
describe('AbleSpace API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TypeOrmModule)
      .useModule(
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          entities: [__dirname + '/../src/**/*.entity.ts'],
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects task access without a token', () =>
    request(app.getHttpServer()).get('/tasks').expect(401));

  it('logs in as guest, then creates, lists and deletes a task', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);

    const token = loginRes.body.accessToken;
    expect(token).toBeDefined();

    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration test task', priority: 'high' })
      .expect(201);

    expect(createRes.body.title).toBe('Integration test task');

    const listRes = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listRes.body).toHaveLength(1);

    await request(app.getHttpServer())
      .delete(`/tasks/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('rejects a task with no title', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);
    const token = loginRes.body.accessToken;

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' })
      .expect(400);
  });

  it('creates a subtask and lists it under its parent only', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);
    const token = loginRes.body.accessToken;

    const parentRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Parent task' })
      .expect(201);
    const parentId = parentRes.body.id;

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Subtask', parentId })
      .expect(201);

    const subtasksRes = await request(app.getHttpServer())
      .get(`/tasks/${parentId}/subtasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(subtasksRes.body).toHaveLength(1);
    expect(subtasksRes.body[0].title).toBe('Subtask');

    // The subtask must not also appear in the top-level task list.
    const topLevelRes = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(
      topLevelRes.body.find((t: { title: string }) => t.title === 'Subtask'),
    ).toBeUndefined();
  });

  it('adds a comment to a task using the current display name', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);
    const token = loginRes.body.accessToken;
    const guestName = loginRes.body.user.displayName;

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Commentable task' })
      .expect(201);

    const commentRes = await request(app.getHttpServer())
      .post(`/tasks/${taskRes.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'First update' })
      .expect(201);

    expect(commentRes.body.authorName).toBe(guestName);
    expect(commentRes.body.content).toBe('First update');
  });

  it('rejects access to another guest\'s task', async () => {
    const ownerLogin = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);
    const intruderLogin = await request(app.getHttpServer())
      .post('/auth/guest')
      .expect(201);

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerLogin.body.accessToken}`)
      .send({ title: "Owner's private task" })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/tasks/${taskRes.body.id}`)
      .set('Authorization', `Bearer ${intruderLogin.body.accessToken}`)
      .expect(404);
  });
});
