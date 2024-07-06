import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';



import { CreateUserDto, LoginUserDto } from './dto';

import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  // proteger la ruta con el guard
  @UseGuards( AuthGuard() ) 
  testingPrivateRoute(
    // @Req() request : Express.Request // acceder a la request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,

  ){

    
    // console.log({ user : request.user}) // ver el usuario que se ha logueado
    // console.log({ user })
    return {
      ok : true,
      message:'You have access to this route',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }
  
  // @SetMetadata('roles', ['admin', 'super-user']) // SetMetadata para agregar metadata a la ruta
  @Get('private2')
  @RoleProtected( ValidRoles.superUser , ValidRoles.user) // proteger la ruta con el guard
  @UseGuards( AuthGuard(), UserRoleGuard ) 
  privateRoute2(
    @GetUser() user: User,
  ){
    
    return {
      ok : true,
      message:'You have access to this route'
    }

  }

  @Get('private3')
  @Auth( ValidRoles.admin ) 
  privateRoute3(
    @GetUser() user: User,
  ){
    
    return {
      ok : true,
      message:'You have access to this route'
    }

  }

}
