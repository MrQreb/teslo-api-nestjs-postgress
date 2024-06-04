import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
