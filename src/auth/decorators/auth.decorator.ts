import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {

    //Decoradores sin arroba
  return applyDecorators(
    RoleProtected( ...roles ), 
    UseGuards(AuthGuard(), UserRoleGuard), 
  );
}

//Mismo que lo de arriba
// @Get('private2')
//   @RoleProtected( ValidRoles.superUser , ValidRoles.user) // proteger la ruta con el guard
//   @UseGuards( AuthGuard(), UserRoleGuard ) 
//   privateRoute2(){
    
//     return {
//       ok : true,
//       message:'You have access to this route'
//     }

//   }
