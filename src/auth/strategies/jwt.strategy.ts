import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";

//Sirve para expandir validacion jwt
// Valida la palabra secreta y dira si es valido o no


@Injectable() //Para que pueda ser inyectado
export class JwtStrategy extends PassportStrategy( Strategy ){
 

    constructor(

        //Patron adaptador
        @InjectRepository(User)

        private readonly userRepository: Repository<User>,

        //Para acceder a variables de entorno
        configService: ConfigService

    ){
        
        super({
            secretOrKey:  configService.get('JWT_SECRET'), //Palabra secreta

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //Extrae el token del header
        });
    }


    //Se llama cuando token no ha expirado y la firma hace match con el payload
    async validate( payload: JwtPayload ): Promise<User>{

        const { id } = payload; //Extrae el id del payload

        //Busca el usuario en la base
        const user = await this.userRepository.findOneBy( { id } );

        if( !user ) throw new UnauthorizedException('token not valid');

        if( !user.isActive ) throw new UnauthorizedException('user is inactive, talk to the admin');

        // console.log(user);
        return user; //Se manda al request del controlador
    }
    
}