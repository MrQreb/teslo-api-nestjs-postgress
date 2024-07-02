export interface JwtPayload {
    email: string;

    //Se puede agregar todo lo que se quiera grabar
    // Validacion personalizada etc

    //Viaja entre cliente y backend y debe ser algo pequeño
}