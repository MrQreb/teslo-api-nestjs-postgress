
export const fileFilter = ( req:Express.Request , file:Express.Multer.File, callback:Function ) =>{
    
    // console.log({file});
    if( !file ) return callback( new Error('No se ha enviado un archivo'), false );
    
    const fileExtension = file.mimetype.split('/')[1]; // image/png
    const validadExtencions = ['jpg','jpeg','png','gif'];

    if( validadExtencions.includes(fileExtension) ){
        return callback(null,true);
    }
    callback(null,false);
}