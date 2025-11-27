import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findAll(filters: any) {
    const { nombre, activo, page = 1, limit = 10 } = filters;
    const query: any = {};

    if (nombre) {
      query.nombre = { $regex: nombre, $options: 'i' };
    }

    if (activo !== undefined) {
      query.activo = activo === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [roles, total] = await Promise.all([
      this.roleModel
        .find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec(),
      this.roleModel.countDocuments(query),
    ]);

    return {
      roles,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).exec();
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async findByNombre(nombre: string) {
    return this.roleModel.findOne({ nombre }).exec();
  }

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleModel.findOne({ 
      nombre: createRoleDto.nombre 
    });

    if (existingRole) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const newRole = new this.roleModel(createRoleDto);
    return newRole.save();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleModel.findById(id);
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    if (updateRoleDto.nombre && updateRoleDto.nombre !== role.nombre) {
      const existingRole = await this.roleModel.findOne({
        nombre: updateRoleDto.nombre,
        _id: { $ne: id }
      });

      if (existingRole) {
        throw new ConflictException('Ya existe otro rol con ese nombre');
      }
    }

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();

    return updatedRole;
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id);
    
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    await this.roleModel.findByIdAndDelete(id);

    return { message: 'Rol eliminado exitosamente' };
  }

  async getRolesDisponibles() {
    const roles = await this.roleModel
      .find({ activo: true })
      .select('nombre descripcion')
      .sort({ nombre: 1 })
      .exec();

    return roles;
  }

  async seedRoles() {
    const rolesCount = await this.roleModel.countDocuments();
    
    if (rolesCount > 0) {
      return { message: 'Los roles ya existen en la base de datos' };
    }

    const defaultRoles = [
      {
        nombre: 'admin',
        descripcion: 'Administrador del sistema con acceso completo',
        permisos: [
          'crear_usuario',
          'editar_usuario',
          'eliminar_usuario',
          'ver_usuarios',
          'crear_venta',
          'editar_venta',
          'eliminar_venta',
          'ver_ventas',
          'ver_reportes',
          'gestionar_productos',
          'gestionar_roles'
        ],
        activo: true
      },
      {
        nombre: 'vendedor',
        descripcion: 'Vendedor con permisos básicos de venta',
        permisos: [
          'crear_venta',
          'ver_ventas',
          'ver_productos'
        ],
        activo: true
      },
      {
        nombre: 'cajero',
        descripcion: 'Cajero para operaciones de punto de venta',
        permisos: [
          'crear_venta',
          'ver_ventas',
          'ver_productos',
          'cobrar'
        ],
        activo: true
      },
      {
        nombre: 'gerente',
        descripcion: 'Gerente con permisos de supervisión',
        permisos: [
          'crear_venta',
          'editar_venta',
          'ver_ventas',
          'ver_reportes',
          'ver_usuarios',
          'gestionar_productos'
        ],
        activo: true
      }
    ];

    await this.roleModel.insertMany(defaultRoles);

    return { 
      message: 'Roles iniciales creados exitosamente',
      roles: defaultRoles.map(r => r.nombre)
    };
  }
}