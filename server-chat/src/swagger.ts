import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chat Application API')
    .setDescription('The Chat Application API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // Đặt một tên duy nhất cho security scheme
    )
    //.addBearerAuth()
    .build();

  // Enable CORS nếu cần
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Chat Application API Docs',
  });

  await app.listen(3231);
  console.log('Swagger documentation is running on http://localhost:3231/api');
  await open('http://localhost:3231/api');
}
bootstrap();
