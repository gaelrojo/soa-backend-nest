import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // GET /roles - Listar todos los roles con filtros
  @Get()
  @Roles('admin')
  async findAll(
    @Query('nombre') nombre?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    return this.rolesService.findAll({ 
      nombre, 
      activo, 
      page: pageNum, 
      limit: limitNum 
    });
  }

  // GET /roles/disponibles/lista - IMPORTANTE: Debe ir ANTES de /:id
  @Get('disponibles/lista')
  @Roles('admin', 'vendedor')
  async getRolesDisponibles() {
    return this.rolesService.getRolesDisponibles();
  }

  // GET /roles/:id - Obtener un rol por ID
  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  // POST /roles - Crear un nuevo rol
  @Post()
  @Roles('admin')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // PUT /roles/:id - Actualizar un rol
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  // DELETE /roles/:id - Eliminar un rol
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  // POST /roles/seed - Inicializar roles (solo para desarrollo)
  @Post('seed')
  @Roles('admin')
  async seed() {
    return this.rolesService.seedRoles();
  }
}