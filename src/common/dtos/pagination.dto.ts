import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    //Type() => convierte el valor a un tipo de dato especifico
    @IsOptional()
    @IsPositive({message: 'Limit must be greater than 0'})
    @Type( () => Number)
    limit?: number;

    @IsOptional()
    @IsPositive()
    @Min(0)
    @Type( () => Number)
    offset?: number;

    // Nota: En coso de no convertir dto manual
    //en main.ts se puede agregar la siguiente linea
    //Transformación de datos automáticamente
    //Consume un poco más de recursos
    // transform: true, //transform => Habilita la transformación de datos
    // transformOptions:{
    //   enableImplicitConversion: true //enableImplicitConversion => convierte los tipos de datos de forma implícita
    // }
}