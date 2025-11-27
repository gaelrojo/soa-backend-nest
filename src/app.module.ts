// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';  // ❌ ELIMINAR esta línea
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { SaleItemsModule } from './sale-items/sale-items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/soa_tienda'
    ),
    RolesModule,
    UsersModule,
    SalesModule,
    SaleItemsModule,
    AuthModule,
  ],
  controllers: [],  // ❌ Dejar vacío o eliminar esta línea
  providers: [],
})
export class AppModule {}