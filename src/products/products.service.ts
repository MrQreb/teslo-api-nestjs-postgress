import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

//validate permite validar si un string es un UUID
import {  validate as isUUID } from 'uuid';


@Injectable()
export class ProductsService {


  //('ProductsService') => nombre del servicio
  private readonly logger = new Logger('ProductsService'); 

  //Patron repositorio
  constructor(
    
    //Sirve para query builders, transaccions, rollbacks, etc
    
    @InjectRepository(Product) //inyecta el repositorio de la entidad Product

    private readonly productRepository: Repository<Product> //Repositorio de la entidad Product
  ) {}


  async create(createProductDto: CreateProductDto) {
    try{

    

      //Crea una nueva instancia de la entidad Product
      const newProduct : Product = this.productRepository.create(createProductDto)

     

      //Pasar todo a minusculas
      this.converProductToLowerCase(newProduct);
      

      //Guarda el producto en la base de datos
      await this.productRepository.save(newProduct);

      return newProduct;

    }catch(error){

      this.handleBDException(error);
      
    }
  }

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10 , offset = 0} = paginationDto;
    
    
    const products = await this.productRepository.find({
      take: limit, //take => permite limitar la cantidad de registros que se obtienen
      skip: offset //skip => permite saltar una cantidad de registros

      //TODO: relaciones
    
    });

    
  
    if( products.length === 0 ){
      throw new BadRequestException('All products were not found');
    }

    return products;
  }


  async findOne(term: string) {

    try{      
      
      let product :Product;

      //Saber si es IUUD

      if( isUUID(term) ){
        product = await this.productRepository.findOneBy({
          id: term
        });
      

      }else{

        //Instancia de query builder
        const queryBuilder = this.productRepository.createQueryBuilder();

        product = await queryBuilder
          //Buscara por title y espera el argumento se llame title
          .where(`LOWER(title)=:title OR LOWER(slug)=:slug`, { 
            //Parametros de la parte del where
            title: term.toLocaleLowerCase(), 
            slug: term.toLocaleLowerCase()
          }).getOne();
          
          // select * from Products where slug ='xx' or title = 'xx'
      }

      return product;

    }catch(error){
      
      throw new BadRequestException(`Product not found with term ${term}`);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    try{

     let product: Product = await this.productRepository.preload({
       id: id,
       ...updateProductDto
     });

     if(!product){
       throw new BadRequestException(`Product not found with term ${id}`);
     }
    
     //paso todas propiedades a minusculas
     this.converProductToLowerCase(product);

     await this.productRepository.save(product);

     return product;

    }catch(error){

      this.handleBDException(error);

    }
    


  }

  async remove(id: string) {

    
    try{


      //Busco producto con mismo metodo
      let product =  await this.findOne(id);
      
      
      await this.productRepository.remove(product);

      return `Successfully deleted product with id ${id}`;
      
      
    }catch(error){

      throw new BadRequestException(`Product not found with term ${id}`);
      
    }    
  }

  private handleBDException(error: any){
    
      if(error.code === '23505')  //23505 => unique_violation
        throw new BadRequestException(error.detail);
      
      //Mostrar error en mejor formato
      this.logger.error(error);
      // console.log(error)

      //Si no encuentra producto
      // if(error.code === '19524')
      //   throw new BadRequestException(error.detail);
      
      this.logger.error(error);

  
      throw new InternalServerErrorException('Unexpected error, check the logs for more information');

      

      
  }

  //Convierte los datos a minisculas
  private converProductToLowerCase(product: Product){
     //Pasar todo a minusculas
     product.title = product.title?.toLocaleLowerCase();
     product.slug = product.slug?.toLocaleLowerCase();
     product.description = product.description?.toLocaleLowerCase();
     product.sizes = product.sizes?.map( size => size.toLocaleLowerCase() );
     product.gender = product.gender?.toLocaleLowerCase();
     product.tags = product.tags?.map( tag => tag.toLocaleLowerCase() );
  }
}
