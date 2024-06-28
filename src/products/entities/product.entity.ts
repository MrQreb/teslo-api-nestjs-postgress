import {  BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

//Entity => define una clase como una entidad de la base de datos
@Entity({ name: 'products'}) //Nombre de la tabla en la base de datos
export class Product {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text',{

        //Constraints => permite definir restricciones en la base de datos
        unique: true
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price:number;

    //Otra forma de definir columnas
    @Column({
        type: 'text',
        nullable: true //permite que el campo sea nulo
    })
    description:string;

    @Column('text',{
        unique: true
    })
    slug:string; //slug => es una cadena que identifica de forma única una entidad en la base de datos

    @Column('int',{
        default: 0
    })
    stock:number;

    @Column('text',{
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column({
        type:'text',
        array:true,
        default:[],

    })
    tags: string[];




    //Triggers 

    //Antes de insertar
    @BeforeInsert()
    checkSlugInsert(){

      //Si no captura un slug
      if( !this.slug ){
        this.slug = this.title
      }
      
      this.slugExists();
      this.truncateNumbers();
      

    }

    @BeforeUpdate()
    checkSlugUpdate(){

      this.slugExists();
      this.truncateNumbers();
      
    }


    slugExists():void{
        this.slug = this.slug
        .toLocaleLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')  
    }

   truncateNumbers():void{

        if( !this.price ){
            return;
        }

        this.price = (+this.price.toFixed(2));

   } 
   
   //Relaciones
   @OneToMany(

        () => ProductImage, //Entidad a la que se relaciona

        ( productImage ) => productImage.product, //Campo de la entidad relacionada que se relaciona con esta entidad

        { 
            cascade: true, //Si se elimina producto se eliminan imagenes
            eager:true     //Carga las imagenes de forma automaticas por la relacion
        } 
   )

    images?: ProductImage[];
}
