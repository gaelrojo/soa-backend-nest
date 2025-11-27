// src/seeds/roles.seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';

async function seedRoles() {
  console.log('🌱 Iniciando seed de roles...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const rolesService = app.get(RolesService);

    const rolesIniciales = [
      {
        slug: 'administrador',
        descripcion: 'Acceso total al sistema',
        permisos: [
          'usuarios.crear',
          'usuarios.editar',
          'usuarios.eliminar',
          'usuarios.listar',
          'productos.crear',
          'productos.editar',
          'productos.eliminar',
          'productos.listar',
          'ventas.crear',
          'ventas.cancelar',
          'ventas.listar',
          'ventas.reportes',
          'roles.asignar',
          'roles.modificar',
          'reportes.generar',
          'reportes.exportar',
          'configuracion.modificar',
        ],
        activo: true,
      },
      {
        slug: 'vendedor',
        descripcion: 'Realiza ventas y consulta productos',
        permisos: [
          'productos.listar',
          'productos.buscar',
          'ventas.crear',
          'ventas.listar_propias',
          'perfil.editar',
        ],
        activo: true,
      },
      {
        slug: 'consultor',
        descripcion: 'Solo consulta reportes y estadísticas',
        permisos: [
          'productos.listar',
          'ventas.listar',
          'ventas.reportes',
          'reportes.generar',
          'reportes.exportar',
        ],
        activo: true,
      },
    ];

    for (const rol of rolesIniciales) {
      try {
        const nuevoRol = await rolesService.create(rol);
        console.log(`✅ Rol "${rol.slug}" creado exitosamente`);
      } catch (error: any) {
        if (error.message && error.message.includes('ya existe')) {
          console.log(`⚠️  Rol "${rol.slug}" ya existe en la base de datos`);
        } else {
          console.error(`❌ Error creando rol "${rol.slug}":`, error.message || error);
        }
      }
    }

    await app.close();
    console.log('🎉 Seed de roles completado');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error fatal en el seed:', error.message || error);
    process.exit(1);
  }
}

seedRoles();