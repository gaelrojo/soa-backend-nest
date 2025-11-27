import { 
  IsString, 
  IsBoolean, 
  IsArray, 
  IsOptional, 
  MaxLength 
} from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  nombre?: string;

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