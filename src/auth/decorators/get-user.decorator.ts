import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(

    ( data:string, ctx:ExecutionContext ) => {
        //Execution context => es un objeto que contiene la peticion y la respuesta
        
        // console.log({data})
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;


        if( !user ) throw new InternalServerErrorException('User not found (request)');

        return (!data) 
            ? user 
            : user[data];  
        

       
    }

);
