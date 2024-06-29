import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';




@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  //UseInterceptors permite interceptar la petición y modificarla
  @UseInterceptors( FileInterceptor('file',{
    fileFilter:fileFilter
  }) )
   uploadProductImage(  
    @UploadedFile() file:Express.Multer.File, // para definir el tipo de dato de un archivo
    
  ){
    
    this.handleFileError(file);

    return {
      fileName: file.originalname
    }
  
  }

  private handleFileError( file:Express.Multer.File ){
    
    if( !file ) throw new BadRequestException('asegurate de enviar una imagen valida');

   
  }
}
