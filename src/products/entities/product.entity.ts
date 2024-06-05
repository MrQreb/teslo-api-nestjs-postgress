import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Entity => define una clase como una entidad de la base de datos
@Entity()
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

    //Antes de insertar
    @BeforeInsert()
    checkSlugInsert(){

      if( !this.slug ){
        this.slug = this.title
      }
      
      this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'')  

    }

}
