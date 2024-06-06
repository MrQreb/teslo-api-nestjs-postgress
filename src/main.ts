import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //prefix para habilitar la ruta de la API
  app.setGlobalPrefix('api/v1');
  
  //Validacion de Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //whitelist => permite que solo los campos definidos en la clase DTO sean válidos
      forbidNonWhitelisted: true, //forbidNonWhitelisted => evita que se envíen campos que no están definidos en la clase DTO
      
      //Transformación de datos automáticamente
      //Consume un poco más de recursos
      // transform: true, //transform => Habilita la transformación de datos
      // transformOptions:{
      //   enableImplicitConversion: true //enableImplicitConversion => convierte los tipos de datos de forma implícita
      // }
    }),
  );

  await app.listen(3000);
}
bootstrap();
