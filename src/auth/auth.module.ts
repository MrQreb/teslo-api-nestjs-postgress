import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService],

  imports:[

    ConfigModule, //Para jwt strategy
    
      
    //TypeOrmModule => permite la integración de TypeORM con NestJS
    //forFeature => permite definir las entidades que se van a utilizar en el módulo
    // [Product,Clothe] => se definen las entidades que se van a utilizar en el módulo
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }), // se registra el módulo de Passport con la estrategia jwt

    JwtModule.registerAsync({
      
      //Forma 1
      imports: [ConfigModule], //Para otra forma
      inject: [ConfigService], //Para otra forma
      
      useFactory: (  configSerive: ConfigService  ) => { //Para otra forma


        //Forma 1
        // console.log('JWT_SECRET', configSerive.get('JWT_SECRET') ); //Asegura tipo de dato y mas cosas

        //Forma 2
        // console.log('JWT_SECRET', process.env.JWT_SECRET);
        
        return {
          secret: process.env.JWT_SECRET , // clave secreta para firmar el token
          signOptions:({
            expiresIn: '2h' // tiempo de expiración del token
          })
        }

      }

    })

    // // JwtModule => permite la integración de JWT con NestJS
    // JwtModule.register({
      
    //   secret: process.env.JWT_SECRET , // clave secreta para firmar el token

    //   signOptions:({
    //     expiresIn: '2h' // tiempo de expiración del token
    //   })
    // })
  ],

  exports: [
    AuthService,
    TypeOrmModule,  //Exporta pasa usar dos entidades en el controlador
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
  
})
export class AuthModule {}
