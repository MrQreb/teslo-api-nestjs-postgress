import { v4 as uuid } from 'uuid';

export const fileNamer = ( req:Express.Request , file:Express.Multer.File, callback:Function ) =>{
    
    
    
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${ uuid() }.${ fileExtension }`; // Nombre unico con extencion
    
    
    
    
    
    callback(null, fileName);
}