import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';



@Injectable()
export class FilesService {
  
    getStaticProductImage(imageName: string) {

        const path = join(__dirname, '../../static/products', imageName); // se une la ruta del archivo con el nombre del archivo

        if( !existsSync(path) )
             throw new BadRequestException( `no product found with image ${imageName}` ); 

        return path; // se retorna la ruta del archivo

    }
}
