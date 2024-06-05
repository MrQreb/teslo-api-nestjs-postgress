import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';


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
      const newProduct = this.productRepository.create(createProductDto)

      //Guarda el producto en la base de datos
      await this.productRepository.save(newProduct);

      return newProduct;

    }catch(error){

      this.handleBDException(error);
      
    }
  }

  async findAll() {
    
    const products = await this.productRepository.find();
  
    if(!products){
      throw new BadRequestException('Products not found');
    }

    return products;
  }


  async findOne(id: string) {

    try{      
      
      let product = await this.productRepository.findOne({
        where: { id }
      });

      return product;

    }catch(error){
      
      throw new BadRequestException(`Product not found with term ${id}`);
    }
    
   
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {

    
    try{

      let product =  await this.findOne(id);
      
      
      this.productRepository.delete({
        id: product.id
      });

      return `Successfully deleted product with id ${id}`;
      
      
    }catch(error){

      throw new BadRequestException(`Product not found with term ${id}`);
      
    }


    

    // return `This action removes a #${id} product`;
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

      
      //Manjear todos erroes centralizados
  }
}
