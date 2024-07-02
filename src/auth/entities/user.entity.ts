import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
      unique:true  
    })
    email:string;

    @Column('text',{
        select:false // no devolver la contraseña
    
    })
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text',{
        array:true,
        default:['user']
    })
    roles:string[];



}
