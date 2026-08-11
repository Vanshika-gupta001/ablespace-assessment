import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { Comment } from './tasks/comment.entity';
import { Project } from './projects/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqljs',
        // sql.js is a pure JS/WASM SQLite build, so it needs no native
        // compiler (unlike better-sqlite3) — this keeps `npm install`
        // dependency-free on any OS. `location` is where it persists to
        // disk and `autoSave` writes changes there after every query.
        location: config.get<string>('DB_PATH', './ablespace.sqlite'),
        autoSave: true,
        entities: [User, Task, Comment, Project],
        synchronize: true, // fine for an assessment project; use migrations in production
      }),
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}
