import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

//Ver usuario y ver si usuario tiene los rolels
@Injectable()
export class UserRoleGuard implements CanActivate {
 

  constructor(
    private readonly reflector:Reflector // para acceder a los metadatos de las rutas
  ){}

  canActivate( // se ejecuta antes de llegar al controlador
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   
    // console.log('useRoleGuard')

    // obtener los roles de la ruta del controlador auth
    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() );  
    // console.log({validRoles});

    if( !validRoles ) return true; // si no hay roles en la ruta se permite el acceso 
    if( validRoles.length === 0 ) return true; // si no hay roles en la ruta se permite el acceso

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if( !user ) throw new BadRequestException('User not found (request)');
    // console.log({ userRoles: user.roles})
    // console.log({ user })

    //Evaluar los roles
    for ( const role of user.roles ) {

      //Si el usuario tiene los roles
      // console.log( ( validRoles.includes(role) ) )
      if( validRoles.includes(role) ) return true;
    }

     //Si el usuario no tiene los roles
     throw new ForbiddenException(
      `User with roles ${user.roles} does not have access to this route need a role [${validRoles}]`
    );



    
    //Depediendo que retorne se ejecuta o no el controlador
    //Tiene al acceso a la ruta o no
    // return true;
  }
}
