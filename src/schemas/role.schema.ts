import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ 
  timestamps: true,
  collection: 'roles'
})
export class Role {
  @Prop({ 
    required: true, 
    unique: true,
    trim: true
  })
  nombre: string;

  @Prop({ 
    trim: true,
    maxlength: 200
  })
  descripcion: string;

  @Prop({ 
    type: [String],
    default: []
  })
  permisos: string[];

  @Prop({ 
    default: true 
  })
  activo: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// Índices
RoleSchema.index({ nombre: 1 });
RoleSchema.index({ activo: 1 });