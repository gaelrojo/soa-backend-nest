import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class SaleItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  sale_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  producto_id: number;

  @Prop()
  productoNombre: string;

  @Prop({ type: Number, required: true })
  cantidad: number;

  @Prop({ type: Number, required: true })
  precio_unitario: number;

  @Prop({ type: Number, required: true })
  subtotal: number;
}

export const SaleItemSchema = SchemaFactory.createForClass(SaleItem);