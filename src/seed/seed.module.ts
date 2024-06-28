import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  

  imports: [
    ProductsModule //Modulo completo para acceso TypeORM y servicios
  ], 
})
export class SeedModule {}
