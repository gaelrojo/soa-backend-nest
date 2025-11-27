import { 
  IsString, 
  IsNotEmpty, 
  IsBoolean, 
  IsArray, 
  IsOptional, 
  MaxLength 
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La descripción no puede exceder 200 caracteres' })
  descripcion?: string;

  @IsArray()
  @IsOptional()
  permisos?: string[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}