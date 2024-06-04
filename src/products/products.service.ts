import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

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
      console.log(error);
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
