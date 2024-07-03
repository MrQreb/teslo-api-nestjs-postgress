import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';



import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'; // encriptar la contraseña
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  logger = new Logger('AuthService');
  // Patron repositorio
  constructor(
    
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly jwtService:JwtService // de nestjs proporcionado por el modulo jwt en auth.module.ts

  ){}

  async create( createUserDto: CreateUserDto) {

    try{

      const { password, ...userData } = createUserDto;

      
      const user = await this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync(password,10) // encriptar la contraseña
      });

      const newUser = await this.userRepository.save(user);

      delete newUser.password; // no devolver la contraseña
      
      return {
        ...newUser,
        token: this.getJwtToken({ email: user.email}) 
       };

    }catch(error){
      this.handleBDException(error);
    }
    

  }

  async login(loginUserDto: LoginUserDto) {
  
    const { email, password } = loginUserDto;
  
    const user = await this.userRepository.findOne({ 
       where: { email },
       select: { email: true, password: true } // solo devolver estos campos
     });

     if(!user) throw new UnauthorizedException('email not found');

     if( !bcrypt.compareSync(password, user.password) ) throw new UnauthorizedException('invalid password');

     return {
      ...user,
      token: this.getJwtToken({ email: user.email}) 
     };
     
    
  }

  //Importar de la interfaz
  private getJwtToken( payload: JwtPayload) {

    //da configurarion del jwt en auth.module.ts del token
    const token = this.jwtService.sign(payload);    

    return token;

  }

  private handleBDException(error: any) {
    
    this.logger.error(`error code:${error.code} - ${error.message}	`);

    if( error.code === '23505 ') throw new BadRequestException('user already exists');
  }
}
