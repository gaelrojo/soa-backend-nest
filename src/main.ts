// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Si tienes un prefijo global, coméntalo temporalmente
  // app.setGlobalPrefix('api');  // ❌ Comenta esta línea
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log(`Aplicación corriendo en: http://localhost:3000`);
}
bootstrap();