import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

//validate permite validar si un string es un UUID
import {  validate as isUUID } from 'uuid';
import { ProductImage } from './entities';


@Injectable()
export class ProductsService {


  //('ProductsService') => nombre del servicio
  private readonly logger = new Logger('ProductsService'); 

  //Patron repositorio
  constructor(
    
    //Sirve para query builders, transaccions, rollbacks, etc
    
    @InjectRepository(Product) //inyecta el repositorio de la entidad Product

    private readonly productRepository: Repository<Product>, //Repositorio de la entidad Product

    //Relacion necesaria para la entidad product
    @InjectRepository(ProductImage) //inyecta el repositorio de la entidad Product
    private readonly productImageRepository: Repository<ProductImage>, //Repositorio de la entidad Product
   
    //Para que conozca la cadena de conexion
    //Necesaria para queryRunner
    private readonly dataSource:DataSource,


  ) {}


  async create(createProductDto: CreateProductDto) {
    try{

      //Extraer imagenes del objeto y el resto de propiedades
      const { images = [] , ...productDetails} = createProductDto;
      

      //Crea una nueva instancia de la entidad Product
      const newProduct : Product = this.productRepository.create({
        ...productDetails, //Propiedades del producto
        

        images: images.map( image => this.productImageRepository.create({url:image})), // instancia de la relacion

      });

     

      //Pasar todo a minusculas
      this.converProductToLowerCase(newProduct);
      

      //Guarda el producto en la base de datos
      await this.productRepository.save(newProduct);

      return {
              ...newProduct,
               images //Retorna imagenes como solo arreglo y no arreglo de objetos
      };

    }catch(error){

      this.handleBDException(error);
      
    }
  }

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10 , offset = 0} = paginationDto;
    
    
    const products = await this.productRepository.find({
      take: limit, //take => permite limitar la cantidad de registros que se obtienen
      skip: offset, //skip => permite saltar una cantidad de registros

      //relations => permite traer las relaciones de la entidad
      relations:{
        images: true //trae las imagenes relacionadasW
      }
      
    });

    
  
    if( products.length === 0 ){
      throw new BadRequestException('All products were not found');
    }

    //Aplana el arreglo de imagenes y retorna solo la url de la imagen
    return products.map( ({ images, ...rest }) => ({
      ...rest,
      images: images.map( image => image.url ) //Solo retorna la url de la imagen, lo retorna como arreglo
    }));
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
        const queryBuilder = this.productRepository.createQueryBuilder('prod');

        product = await queryBuilder
          //Buscara por title y espera el argumento se llame title
          .where(`LOWER(title)=:title OR LOWER(slug)=:slug`, { 
            //Parametros de la parte del where
            title: term.toLocaleLowerCase(), 
            slug: term.toLocaleLowerCase()
          })
          .leftJoinAndSelect('prod.images','prodImages') //Primer argumento es el nombre de la relacion y el segundo es el alias
          .getOne();
          
          // select * from Products where slug ='xx' or title = 'xx'
      }

      
      


      return product;

    }catch(error){
      
      throw new BadRequestException(`Product not found with term ${term}`);
    }
  }

  //Intermedio para regresar el objeto
  async findOnePlain(term: string) {
      
    const { images = [], ...product }= await this.findOne(term);
    return {
      ...product,
      imagenes: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const { images, ...toUpdate } = updateProductDto;

  

     let product: Product = await this.productRepository.preload({
       id: id,
       ...toUpdate
     });

     if(!product){
       throw new BadRequestException(`Product not found with term ${id}`);
     }

     //Query Runner => permite ejecutar querys de forma manual
     const queryRunner = this.dataSource.createQueryRunner();

     await queryRunner.connect(); //Conecta a la base de datos
     await queryRunner.startTransaction(); //Inicia una transaccion

     
     try{

      //Borrar imagenes anterior
      if( images ){
        await queryRunner.manager.delete( ProductImage, { product:{id} } ); //Elimina todas las imagenes relacionadas con el producto
        
        product.images = images.map(
           image => this.productImageRepository.create({url:image})
        ); // instancia de la relacion e inserta

      }

      await queryRunner.manager.save(product); //Intenta grabarlo en la base de datos

      await queryRunner.commitTransaction(); //Confirma la transaccion
      await queryRunner.release(); //Libera el queryRunner
      
    
     //paso todas propiedades a minusculas
     this.converProductToLowerCase(product);
    

     return this.findOnePlain(id); //Retorna el producto actualizado pero plano

    }catch(error){

      await queryRunner.rollbackTransaction(); //Rollback de la transaccion
      await queryRunner.release(); //Libera el queryRunner

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


  //Metodo solo en desarrollo
  async deleteAllProducts(){
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    try{

      return await queryBuilder
      .delete()
      .where({}) //Borra todos los registros
      .execute(); 

    }catch(error){
      throw new InternalServerErrorException('Error deleting all products');
    }
  }
}
