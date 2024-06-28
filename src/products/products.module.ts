import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


import { Product, ProductImage } from './entities/index';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    
    //TypeOrmModule => permite la integración de TypeORM con NestJS
    //forFeature => permite definir las entidades que se van a utilizar en el módulo
    // [Product,Clothe] => se definen las entidades que se van a utilizar en el módulo
    TypeOrmModule.forFeature([Product,ProductImage]	),
  ],

  //Exporta el servicio para que pueda ser utilizado en otros módulos
  exports: [
    ProductsService,
    TypeOrmModule  //Exporta pasa usar dos entidades en el controlador
  ] 
})
export class ProductsModule {}
