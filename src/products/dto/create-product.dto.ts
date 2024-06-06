import { IsInt, IsArray , IsNumber, IsOptional,
         IsPositive, IsString, MinLength, IsIn, 
         Min,
         Max} from "class-validator";

export class CreateProductDto {
   
   
    @IsString()
    @MinLength(3)
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(150)
    @Max(2500)
    
    price?:number;

    @IsString()
    @IsOptional()
    description?:string;

    @IsString()
    @IsOptional()
    slug?:string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;


    @IsString({each:true}) //each:true => valida cada elemento del array
    @IsArray()
    sizes:string[];

    @IsIn(['men','kid','women','unisex'])
    gender:string;

   
    @IsString({each:true}) //each:true => valida cada elemento del array
    @IsArray()
    @IsOptional()
    tags?:string[];
}
