import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';

async function bootstrap() {
  console.log('🚀 Iniciando aplicación para seed de roles...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesService = app.get(RolesService);

  const rolesIniciales = [
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
        'gestionar_roles',
        'configuracion.sistema',
      ],
      activo: true,
    },
    {
      nombre: 'vendedor',
      descripcion: 'Vendedor con permisos básicos de venta',
      permisos: [
        'crear_venta',
        'ver_ventas',
        'ver_productos',
        'productos.listar',
        'ventas.listar',
        'ventas.reportes',
      ],
      activo: true,
    },
    {
      nombre: 'cajero',
      descripcion: 'Cajero para operaciones de punto de venta',
      permisos: [
        'crear_venta',
        'ver_ventas',
        'ver_productos',
        'cobrar',
        'productos.listar',
        'ventas.listar',
      ],
      activo: true,
    },
    {
      nombre: 'gerente',
      descripcion: 'Gerente con permisos de supervisión y consulta reportes y estadísticas',
      permisos: [
        'productos.listar',
        'ventas.listar',
        'ventas.reportes',
        'reportes.general',
        'reportes.exportar',
      ],
      activo: true,
    },
  ];

  try {
    console.log('📊 Verificando roles existentes...\n');

    for (const rol of rolesIniciales) {
      try {
        await rolesService.create(rol);
        console.log(`✅ Rol "${rol.nombre}" creado exitosamente`);
      } catch (error) {
        if (error.message.includes('ya existe')) {
          console.log(`⚠️  Rol "${rol.nombre}" ya existe en la base de datos`);
        } else {
          console.error(`❌ Error creando rol "${rol.nombre}":`, error.message);
        }
      }
    }

    console.log('\n🎉 Proceso de seed completado\n');
  } catch (error) {
    console.error('\n❌ Error general en el seed:', error.message);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();