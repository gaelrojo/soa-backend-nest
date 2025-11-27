import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsNumber()
  producto_id: number;

  @IsString()
  productoNombre: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  vendedorNombre?: string;

  @IsOptional()
  @IsString()
  vendedorEmail?: string;

  @IsOptional()
  fechaVenta?: Date;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  metodoPago?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}