// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { zip } from 'rxjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, minlength: 3 })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  // ✅ NUEVO: Referencia al rol
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  rol_id: Types.ObjectId;

  // ✅ NUEVO: Nombre del rol desnormalizado
  @Prop({ required: true, trim: true })
  rol_nombre: string;

  @Prop({ trim: true })
  nombre_completo: string;

  @Prop({ trim: true })
  telefono: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: Date.now })
  fecha_creacion: Date;

  @Prop({ default: Date.now })
  fecha_actualizacion: Date;

  @Prop()
  ultimo_acceso: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índices
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ rol_id: 1 });
UserSchema.index({ activo: 1 });