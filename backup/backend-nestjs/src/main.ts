import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Sistema de Reservas API')
    .setDescription('API para gestión de reservas multi-sede (salas y estacionamientos)')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('sites', 'Gestión de sedes')
    .addTag('resources', 'Gestión de recursos')
    .addTag('bookings', 'Gestión de reservas')
    .addTag('users', 'Gestión de usuarios')
    .addTag('auth', 'Autenticación')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación API: http://localhost:${port}/api/docs`);
}

bootstrap();