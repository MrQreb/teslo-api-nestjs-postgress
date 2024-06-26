import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "./product.entity"; //Importamos la entidad Product para relacion

//Entity => define una clase como una entidad de la base de datos
@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(

        () => Product, //Relacion con la entidad Product

        ( product ) => product.images //Campo de la entidad Product que se relaciona con esta entidad 

    )

    product: Product; //Campo de la entidad Product que se relaciona con esta entidad
}