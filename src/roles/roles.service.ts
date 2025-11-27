// src/roles/roles.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto } from '../dto/roles/create-role.dto';
import { UpdateRoleDto } from '../dto/roles/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const nuevoRol = new this.roleModel(createRoleDto);
      return await nuevoRol.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('El slug ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find().exec();
  }

  async findActive(): Promise<Role[]> {
    return await this.roleModel.find({ activo: true }).exec();
  }

  async findOne(id: string): Promise<Role> {
    const rol = await this.roleModel.findById(id).exec();
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async findBySlug(slug: string): Promise<Role> {
    const rol = await this.roleModel.findOne({ slug: slug.toLowerCase() }).exec();
    if (!rol) {
      throw new NotFoundException(`Rol con slug "${slug}" no encontrado`);
    }
    return rol;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const rolActualizado = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();
    
    if (!rolActualizado) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    
    return rolActualizado;
  }

  async remove(id: string): Promise<Role> {
    const rol = await this.roleModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    
    return rol;
  }

  async hasPermission(rolId: string, permiso: string): Promise<boolean> {
    const rol = await this.findOne(rolId);
    return rol.permisos.includes(permiso);
  }

  async getPermissions(rolId: string): Promise<string[]> {
    const rol = await this.findOne(rolId);
    return rol.permisos;
  }
}