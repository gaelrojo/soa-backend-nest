// src/dto/roles/create-role.dto.ts
import { IsString, IsArray, IsBoolean, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  @MinLength(3, { message: 'El slug debe tener al menos 3 caracteres' })
  slug: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsArray({ message: 'Los permisos deben ser un array' })
  @IsString({ each: true, message: 'Cada permiso debe ser un string' })
  @IsNotEmpty({ message: 'Debe proporcionar al menos un permiso' })
  permisos: string[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}