import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';



@Module({
  imports: [

    // Permite usar variables de entorno
    ConfigModule.forRoot(),

    //Configurar typeOrm
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      
      
      autoLoadEntities: true, // Carga las entidades de forma automática
      synchronize: true, // Crea las tablas automáticamente 
      //syncronize: false, en producción
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
