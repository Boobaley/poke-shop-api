import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.use(cookieParser());

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('IT_SHATLE')
    .setDescription('Training Api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  Logger.log(`🚀 Server running on http://localhost:${PORT}`, 'Bootstrap');
}

bootstrap();
