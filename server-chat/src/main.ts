import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'node:fs';
import { AllExceptionsFilter } from './exception/all-Exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false, // <--- THIS
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS nếu cần
  app.enableCors();

  // Add ValidationPipe
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   transform: true,
  //   forbidNonWhitelisted: true,
  //   transformOptions: {
  //     enableImplicitConversion: true,
  //   },
  // }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3231);
}

bootstrap().catch((err) => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
  console.log(err);
});
