import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

//META_ROLES es el nombre de la metadata
//Por si se tiene que cambiar la metadata se cambia en un solo lugar
export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) =>{
    return  SetMetadata( META_ROLES, args );    
};
