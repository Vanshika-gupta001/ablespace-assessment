import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Strip unknown fields and enforce DTO validation on every request.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Trailing slashes are a common copy-paste mistake in the CORS_ORIGIN env
  // var (e.g. "https://app.vercel.app/"), but the browser's Origin header
  // never includes one — so strip it here rather than requiring an exact
  // match on a value that's easy to get subtly wrong in a dashboard field.
  const rawOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const allowedOrigin = rawOrigin.trim().replace(/\/+$/, '');

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AbleSpace API')
    .setDescription('Task management API for the AbleSpace assessment')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`AbleSpace API running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();