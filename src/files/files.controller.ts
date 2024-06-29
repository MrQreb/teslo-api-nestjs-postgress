import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Logger, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { fileFilter,fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';






@Controller('files')
export class FilesController {

  logger = new Logger(FilesController.name); 
  
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService // para acceder a las variables de entorno
  ) {}

  @Get('product/:imageName')
  findProductImage(
    
    
    //Rompe la funcionalidad de nest para manualmente enviar la respuesta
    @Res() res:Response, //enviar una respuesta
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);

    //Ver si el archivo existe en la ruta
    // res.status(403).json({
      // ok:false,
      // path: path
    // });

    res.sendFile(path); //enviar el archivo

  }

  
  @Post('product')
  //UseInterceptors permite interceptar la petición y modificarla
  @UseInterceptors( FileInterceptor('file',{
    
    fileFilter: fileFilter,
    limits:{ fileSize: 1024 * 1024 * 5 }, // 5MB, limite de tamaño de archivo
    
    storage: diskStorage({  // donde se va a guardar el archivo en la parte fisica del servidor
      
      destination:'./static/products', // donde se va a guardar el archivo
      filename:fileNamer // como se va a llamar el archivo
    })


  }) )
   uploadProductImage(  
    @UploadedFile() file:Express.Multer.File, // para definir el tipo de dato de un archivo
    
  ){
    console.log(file)

    this.handleFileError(file);

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`; // se obtiene la url del archivo

    return {
      secureUrl
    }
  
  }

  private handleFileError( file:Express.Multer.File ){

    this.logger.error(file);
    
    if( !file ) throw new BadRequestException('asegurate de enviar una imagen valida');

   
  }
}
