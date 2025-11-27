// src/schemas/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ type: [String], required: true, default: [] })
  permisos: string[];

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  fecha_creacion: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// Índices
RoleSchema.index({ slug: 1 });
RoleSchema.index({ activo: 1 });