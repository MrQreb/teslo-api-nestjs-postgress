import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()


export class SeedService {
 

  
  //Patron repositorio
  constructor(
    private readonly productsService: ProductsService,
  ){}

  async runSeed() {
    
    await this.insertNewProducts(); //Borra todos los productos e inserta nuevos
    return 'seed executed';
    
  }

   private async insertNewProducts() {
   
    await this.productsService.deleteAllProducts();

    //Obtiene los productos iniciales
    const products = initialData.products;

    //Insert de manera simultanea
    const insertPromises = [];

    
    products.forEach( product =>{

        //Crea una promesa por cada producto a insertar
        insertPromises.push( this.productsService.create(product) );
    })

    //Espera a que todas las promesas se resuelvan
    await Promise.all(insertPromises);

    return true;
  }
}
