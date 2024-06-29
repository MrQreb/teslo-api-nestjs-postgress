import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AppModule } from 'src/app.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[
    ConfigModule // exportar el modulo de configuración para el path en files
  ]
})
export class FilesModule {}
