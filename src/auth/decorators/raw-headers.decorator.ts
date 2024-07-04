import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator(

    ( data:string, ctx:ExecutionContext ) => {
        //Execution context => es un objeto que contiene la peticion y la respuesta
        
        // console.log({data})
        const request = ctx.switchToHttp().getRequest();

        // console.log({request})
        const rawHeaders = request.rawHeaders;
        // console.log(rawHeaders)

        return rawHeaders
    }

);